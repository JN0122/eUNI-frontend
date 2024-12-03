import ContentBlock from "../../components/content/ContentBlock.jsx";
import { useTranslation } from "react-i18next";
import { Button, Flex, notification, Table } from "antd";
import ScheduleCell from "./ScheduleCell.jsx";
import { getStudyDays } from "../../enums/days.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getSchedule } from "../../api/schedule.js";
import getNotificationConfig from "../../helpers/getNotificationConfig.js";
import getWeekNumber from "../../helpers/getWeekNumber.js";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import getStylesBasedOnClassType from "../../helpers/getStylesBasedOnClassType.js";
import { useUser } from "../../hooks/useUser.jsx";

function getRows(data) {
    if (data === null) return null;
    return data.schedule.map((row) => {
        return {
            key: row.id,
            hour: row.hour,
            monday: <ScheduleCell cellData={row.monday} />,
            tuesday: <ScheduleCell cellData={row.tuesday} />,
            wednesday: <ScheduleCell cellData={row.wednesday} />,
            thursday: <ScheduleCell cellData={row.thursday} />,
            friday: <ScheduleCell cellData={row.friday} />,
            saturday: <ScheduleCell cellData={row.saturday} />,
            sunday: <ScheduleCell cellData={row.sunday} />
        };
    });
}

function Schedule() {
    const { t } = useTranslation();
    const { currentFieldOfStudyInfo } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);
    const [displayScheduleDate, setDisplayScheduleDate] = useState({
        weekNumber: getWeekNumber(new Date()),
        year: new Date().getFullYear()
    });

    const onArrowClick = function (step) {
        setIsLoading(true);
        setDisplayScheduleDate((prev) => {
            const newScheduleDate = {
                ...prev
            };
            newScheduleDate.weekNumber = newScheduleDate.weekNumber + step;
            return newScheduleDate;
        });
    };

    const calculateRowSpan = useCallback(
        function (data) {
            const rowSpan = {};
            getStudyDays(currentFieldOfStudyInfo?.isFullTime).map((day) => {
                let prevSpan = 1;
                const span = [];
                data.schedule.map((row) => {
                    let hours = row[day]?.hours;
                    if (hours) {
                        prevSpan += hours - 1;
                        span.push(hours);
                    } else if (prevSpan === 1) {
                        span.push(prevSpan);
                    } else {
                        prevSpan--;
                        span.push(0);
                    }
                });
                rowSpan[day] = span;
            });
            return rowSpan;
        },
        [currentFieldOfStudyInfo?.isFullTime]
    );

    const getClassesType = useCallback(
        function (index, day) {
            return data.schedule[index][day]?.type;
        },
        [data?.schedule]
    );

    const rowSpan = useMemo(() => {
        if (data === null) return null;
        return calculateRowSpan(data);
    }, [calculateRowSpan, data]);

    const getRowSpan = useCallback(
        function (index, day) {
            const classType = getClassesType(index, day);
            return {
                rowSpan: rowSpan[day][index],
                style: getStylesBasedOnClassType(classType)
            };
        },
        [getClassesType, rowSpan]
    );

    const getScheduleData = useCallback(
        async function () {
            const response = await getSchedule({
                ...displayScheduleDate,
                fieldOfStudyLogId: currentFieldOfStudyInfo.fieldOfStudyLogId,
                groupIds: currentFieldOfStudyInfo.groups.map(
                    (group) => group.groupId
                )
            });
            if (response.status === 200) {
                setData(response.data);
                setIsLoading(false);
            } else {
                notification.error(
                    getNotificationConfig(t("error-unexpected"))
                );
            }
        },
        [
            currentFieldOfStudyInfo?.fieldOfStudyLogId,
            currentFieldOfStudyInfo?.groups,
            displayScheduleDate,
            t
        ]
    );

    useEffect(() => {
        if (currentFieldOfStudyInfo) getScheduleData();
    }, [currentFieldOfStudyInfo, getScheduleData]);

    const columns = useMemo(
        () => [
            {
                title: t("no."),
                dataIndex: "key",
                rowScope: "key",
                align: "center",
                className: "vertical-middle"
            },
            {
                title: t("hour"),
                dataIndex: "hour",
                rowScope: "row",
                align: "center",
                className: "vertical-middle"
            },
            ...getStudyDays(currentFieldOfStudyInfo?.isFullTime).map((day) => {
                return {
                    title: t(day.toString()),
                    dataIndex: day.toString(),
                    align: "center",
                    onCell: (_, index) => getRowSpan(index, day.toString())
                };
            })
        ],
        [currentFieldOfStudyInfo?.isFullTime, getRowSpan, t]
    );

    return (
        <ContentBlock breadcrumbs={[{ title: t("schedule") }]}>
            <Flex
                align={"center"}
                justify={"space-between"}
                style={{ padding: "1rem 0" }}
            >
                <Button
                    disabled={!data?.canFetchPreviousWeek}
                    shape="circle"
                    icon={<LeftOutlined />}
                    onClick={() => onArrowClick(-1)}
                />
                {!isLoading && data?.date}
                <Button
                    disabled={!data?.canFetchNextWeek}
                    shape="circle"
                    icon={<RightOutlined />}
                    onClick={() => onArrowClick(1)}
                />
            </Flex>
            <Table
                pagination={false}
                loading={isLoading}
                columns={columns}
                dataSource={getRows(data)}
                scroll={{
                    x: "max-content"
                }}
            />
        </ContentBlock>
    );
}

export default Schedule;
