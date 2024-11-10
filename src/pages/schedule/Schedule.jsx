import ContentBlock from "../../components/ContentBlock.jsx";
import { useTranslation } from "react-i18next";
import { ConfigProvider, Table } from "antd";
import ScheduleCell from "./ScheduleCell.jsx";
import DAYS from "../../enums/weekDays.js";
import CLASSES_TYPE from "../../enums/classesType.js";

const data = {
    id: 3,
    date: "07.10.2024 - 14.10.2024",
    schedule: [
        {
            id: 0,
            hour: "7:30-8:15",
            monday: {},
            tuesday: {},
            wednesday: {
                hours: 2,
                name: "Podstawy wytrzymałości materiałów",
                room: "A312",
                type: 0,
            },
            thursday: {},
            friday: {},
            saturday: {
                hours: 3,
                name: "Programowanie obiektowe",
                room: "J204",
                type: 0,
                assessment: {
                    name: "Kolokwium z działu 1",
                },
            },
            sunday: {},
        },
        {
            id: 1,
            hour: "8:15-9:00",
            monday: {},
            tuesday: {},
            wednesday: {},
            thursday: {},
            friday: {},
            saturday: {},
            sunday: {},
        },
        {
            id: 2,
            hour: "9:15-10:00",
            monday: {},
            tuesday: {},
            wednesday: {
                hours: 1,
                name: "Podstawy wytrzymałości materiałów II",
                room: "B122",
                type: 4,
            },
            thursday: {},
            friday: {},
            saturday: {},
            sunday: {},
        },
    ],
};

function calculateRowSpan() {
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

const rowSpan = calculateRowSpan();

function getRows(data) {
    return data.schedule.map((row) => {
        return {
            key: row.id + 1,
            number: row.id,
            hour: row.hour,
            monday: <ScheduleCell cellData={row.monday} />,
            tuesday: <ScheduleCell cellData={row.tuesday} />,
            wednesday: <ScheduleCell cellData={row.wednesday} />,
            thursday: <ScheduleCell cellData={row.thursday} />,
            friday: <ScheduleCell cellData={row.friday} />,
            saturday: <ScheduleCell cellData={row.saturday} />,
            sunday: <ScheduleCell cellData={row.sunday} />,
        };
    });
}

function getClassesType(index, day) {
    return data.schedule[index][day]?.type;
}

function getRowSpan(index, day) {
    const classType = getClassesType(index, day);
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
            ...additionalStyles,
        },
    };
}

function Schedule() {
    const { t } = useTranslation();

    const columns = [
        {
            title: t("no."),
            dataIndex: "key",
            rowScope: "key",
            align: "center",
            className: "vertical-middle",
        },
        {
            title: t("hour"),
            dataIndex: "hour",
            rowScope: "row",
            align: "center",
            className: "vertical-middle",
        },
        ...DAYS.map((day) => {
            return {
                title: t(day.toString()),
                dataIndex: day.toString(),
                align: "center",
                onCell: (_, index) => getRowSpan(index, day.toString()),
            };
        }),
    ];

    return (
        <ConfigProvider
            theme={{
                components: {
                    Table: {
                        borderColor: null,
                    },
                },
            }}
        >
            <ContentBlock breadcrumbs={[{ title: t("schedule") }]}>
                <Table
                    pagination={false}
                    columns={columns}
                    bordered={false}
                    dataSource={getRows(data)}
                    scroll={{
                        x: "max-content",
                    }}
                />
            </ContentBlock>
        </ConfigProvider>
    );
}

export default Schedule;
