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
import { Flex } from "antd";
import useAcademicYears from "../../hooks/options/useAcademicYears.js";
import useSemesterTypesOptions from "../../hooks/options/useSemesterTypesOptions.js";

export default function YearOrganization() {
    const { t } = useTranslation();
    const academicYearsOptions = useAcademicYears();
    const semesterTypesOptions = useSemesterTypesOptions();
    const rows = [
        {
            id: "1",
            key: "1",
            yearNameId: 1,
            yearName: "2024/2025",
            firstHalfOfYear: true.toString(),
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
                <Flex
                    gap="small"
                    style={{
                        paddingBottom: "1rem",
                        flexDirection: "row-reverse"
                    }}
                >
                    <DrawerNewItemButton label={t("create-organization")} />
                </Flex>
                <FormDrawer
                    valuesOnEdit={rows[0]}
                    title={{ edit: "Edytuj", create: "Utwórz" }}
                >
                    <FormItemSelect
                        label={t("academic-year")}
                        name="yearNameId"
                        options={academicYearsOptions}
                        disabled={true}
                        isRequired={true}
                    />
                    <FormItemSelect
                        label={t("semester-type")}
                        name="firstHalfOfYear"
                        options={semesterTypesOptions}
                        disabled={true}
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
