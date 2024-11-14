import ContentBlock from "../../components/ContentBlock.jsx";
import { useTranslation } from "react-i18next";
import { ConfigProvider, notification, Table } from "antd";
import ScheduleCell from "./ScheduleCell.jsx";
import DAYS from "../../enums/weekDays.js";
import CLASSES_TYPE from "../../enums/classesType.js";
import { useCallback, useEffect, useState } from "react";
import { getSchedule } from "../../api/schedule.js";
import getNotificationConfig from "../../helpers/getNotificationConfig.js";
import { useStudentContext } from "../../context/StudentContext.jsx";
import getWeekNumber from "../../helpers/getWeekNumber.js";

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
    const { studentInfo, currentFieldOfStudyInfo } = useStudentContext();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({});
    const [displayScheduleDate, setDisplayScheduleDate] = useState({
        weekNumber: getWeekNumber(new Date()),
        year: new Date().getFullYear()
    });
    
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

            let additionalStyles = {};
            switch (classType) {
                case CLASSES_TYPE.lecture:
                    additionalStyles.backgroundColor = "brown";
                    additionalStyles.color = "white";
                    break;
                case CLASSES_TYPE.laboratory:
                    additionalStyles.backgroundColor = "darkblue";
                    additionalStyles.color = "white";
                    break;
            }
            return {
                rowSpan: rowSpan[day][index],
                style: {
                    padding: 0,
                    verticalAlign: "middle",
                    ...additionalStyles
                }
            };
        },
        [data, getClassesType]
    );

    const getScheduleData = useCallback(
        async function () {
            const response = await getSchedule({
                ...displayScheduleDate,
                fieldOfStudyLogId: currentFieldOfStudyInfo.fieldOfStudyLogId,
                groupIds: currentFieldOfStudyInfo.groups
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
        [currentFieldOfStudyInfo, displayScheduleDate, t]
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
