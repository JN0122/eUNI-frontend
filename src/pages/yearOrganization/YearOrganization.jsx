import { DrawerProvider } from "../../hooks/useDrawer.jsx";
import DrawerNewItemButton from "../../components/form/DrawerNewItemButton.jsx";
import ContentBlock from "../../components/content/ContentBlock.jsx";
import { useTranslation } from "react-i18next";
import TableWithActions from "../../components/content/TableWithActions.jsx";
import { useMemo } from "react";
import dayjs from "dayjs";
import FormDrawer from "../../components/form/FormDrawer.jsx";
import { FormItemSelect } from "../../components/form/FormItemSelect.jsx";
import FormItemDatePicker from "../../components/form/FormItemDatePicker.jsx";

export default function YearOrganization() {
    const { t } = useTranslation();
    const rows = [
        {
            id: "1",
            key: "1",
            yearNameId: 1,
            yearName: "2024/2025",
            firstHalfOfYear: "true",
            semesterType: t("winter-semester"),
            startDate: "2024-10-22",
            startDateParsed: dayjs("2024-10-22"),
            endDate: "2025-01-26",
            endDateParsed: dayjs("2025-01-26"),
            daysOff: ["2024-11-11", "2024-10-20"],
            daysOffJoined: "2024-11-11, 2024-10-20",
            daysOffParsed: [dayjs("2024-11-11"), dayjs("2024-10-20")]
        }
    ];

    const columns = useMemo(
        () => [
            {
                title: t("academic-year"),
                dataIndex: "yearName"
            },
            {
                title: t("semester-type"),
                dataIndex: "semesterType"
            },
            {
                title: t("start-date"),
                dataIndex: "startDate"
            },
            {
                title: t("end-date"),
                dataIndex: "endDate"
            },
            {
                title: t("days-off"),
                dataIndex: "daysOffJoined",
                width: 150
            }
        ],
        [t]
    );

    return (
        <ContentBlock breadcrumbs={[{ title: t("year-organization") }]}>
            <DrawerProvider>
                <DrawerNewItemButton label={t("create-organization")} />
                <FormDrawer
                    initialValues={rows[0]}
                    title={{ edit: "Edytuj", create: "Utwórz" }}
                >
                    <FormItemSelect
                        label={t("academic-year")}
                        name="yearNameId"
                        options={[
                            { value: 1, label: "2024/2025" },
                            { value: 2, label: "2025/2026" }
                        ]}
                        isRequired={true}
                    />
                    <FormItemSelect
                        label={t("semester-type")}
                        name="firstHalfOfYear"
                        options={[
                            { value: "true", label: t("winter-semester") }
                        ]}
                        isRequired={true}
                    />
                    <FormItemDatePicker
                        label={t("start-date")}
                        name="startDateParsed"
                        isRequired={true}
                    />
                    <FormItemDatePicker
                        label={t("end-date")}
                        name="endDateParsed"
                        isRequired={true}
                    />
                    <FormItemDatePicker
                        label={t("days-off")}
                        name="daysOffParsed"
                        isRequired={true}
                        multiple
                    />
                </FormDrawer>
                <TableWithActions columns={columns} rows={rows} />
            </DrawerProvider>
        </ContentBlock>
    );
}
