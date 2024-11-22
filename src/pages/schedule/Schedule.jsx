import ContentBlock from "../../components/ContentBlock.jsx";
import { useTranslation } from "react-i18next";
import { Button, ConfigProvider, Flex, notification, Table } from "antd";
import ScheduleCell from "./ScheduleCell.jsx";
import DAYS from "../../enums/weekDays.js";
import { useCallback, useEffect, useState } from "react";
import { getSchedule } from "../../api/schedule.js";
import getNotificationConfig from "../../helpers/getNotificationConfig.js";
import getWeekNumber from "../../helpers/getWeekNumber.js";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import getStylesBasedOnClassType from "../../helpers/getStylesBasedOnClassType.js";
import { useUser } from "../../context/UserContext.jsx";

function getRows(data) {
    if (Object.keys(data).length === 0) return null;
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

function calculateRowSpan(data) {
    const rowSpan = {};
    DAYS.map((day) => {
        let prevSpan = 1;
        const span = [];
        data.schedule.map((row) => {
            let hours = row[day]?.hours;
            if (hours) {
                prevSpan += hours;
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
}

function Schedule() {
    const { t } = useTranslation();
    const { studentInfo } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({});
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

    const getClassesType = useCallback(
        function (index, day) {
            return data.schedule[index][day]?.type;
        },
        [data.schedule]
    );

    const getRowSpan = useCallback(
        function (index, day) {
            const classType = getClassesType(index, day);
            const rowSpan = calculateRowSpan(data);

            return {
                rowSpan: rowSpan[day][index],
                style: getStylesBasedOnClassType(classType)
            };
        },
        [data, getClassesType]
    );

    const getScheduleData = useCallback(
        async function () {
            const { fieldsOfStudyInfo, currentFieldOfStudy } = studentInfo;
            const response = await getSchedule({
                ...displayScheduleDate,
                fieldOfStudyLogId:
                    fieldsOfStudyInfo[currentFieldOfStudy].fieldOfStudyLogId,
                groupIds: fieldsOfStudyInfo[currentFieldOfStudy].groupIds
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
            displayScheduleDate,
            studentInfo?.currentFieldOfStudy,
            studentInfo?.fieldOfStudyInfo,
            t
        ]
    );

    useEffect(() => {
        if (studentInfo) getScheduleData();
    }, [getScheduleData, studentInfo]);

    const columns = [
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
        ...DAYS.map((day) => {
            return {
                title: t(day.toString()),
                dataIndex: day.toString(),
                align: "center",
                onCell: (_, index) => getRowSpan(index, day.toString())
            };
        })
    ];

    return (
        <ConfigProvider
            theme={{
                components: {
                    Table: {
                        borderColor: null
                    }
                }
            }}
        >
            <ContentBlock breadcrumbs={[{ title: t("schedule") }]}>
                <Flex
                    align={"center"}
                    justify={"space-between"}
                    style={{ padding: "1rem 0" }}
                >
                    <Button
                        shape="circle"
                        icon={<LeftOutlined />}
                        onClick={() => onArrowClick(-1)}
                    />
                    {!isLoading && data.date}
                    <Button
                        shape="circle"
                        icon={<RightOutlined />}
                        onClick={() => onArrowClick(1)}
                    />
                </Flex>
                <Table
                    pagination={false}
                    loading={isLoading}
                    columns={columns}
                    bordered={false}
                    dataSource={getRows(data)}
                    scroll={{
                        x: "max-content"
                    }}
                />
            </ContentBlock>
        </ConfigProvider>
    );
}

export default Schedule;
