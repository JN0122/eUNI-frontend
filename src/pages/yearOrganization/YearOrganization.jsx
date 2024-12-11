import { DrawerProvider } from "../../hooks/useDrawer.jsx";
import DrawerNewItemButton from "../../components/form/DrawerNewItemButton.jsx";
import ContentBlock from "../../components/content/ContentBlock.jsx";
import { useTranslation } from "react-i18next";
import TableWithActions from "../../components/content/TableWithActions.jsx";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import FormDrawer from "../../components/form/FormDrawer.jsx";
import { FormItemSelect } from "../../components/form/FormItemSelect.jsx";
import FormItemDatePicker from "../../components/form/FormItemDatePicker.jsx";
import { Flex } from "antd";
import useAcademicYears from "../../hooks/options/useAcademicYears.js";
import useSemesterTypesOptions from "../../hooks/options/useSemesterTypesOptions.js";
import useNextAcademicSemester from "../../hooks/options/useNextAcademicSemester.js";
import { getYearOrganizations } from "../../api/admin.js";
import { useApiWithLoading } from "../../hooks/useApiWithLoading.js";
import { useNotification } from "../../hooks/useNotification.jsx";

export default function YearOrganization() {
    const { t } = useTranslation();
    const { handleApiError } = useNotification();
    const academicYearsOptions = useAcademicYears();
    const semesterTypesOptions = useSemesterTypesOptions();
    const nextAcademicSemester = useNextAcademicSemester();

    const [rows, setRows] = useState([]);

    const [getYearOrganizationsRequest, isLoading] = useApiWithLoading(
        getYearOrganizations,
        (data) =>
            setRows(
                data.map((row) => {
                    row.key = row.id;
                    row.yearName = academicYearsOptions.find(
                        (type) => type.value === row.yearId
                    ).label;
                    row.firstHalfOfYear = row.firstHalfOfYear.toString();
                    row.semesterType = semesterTypesOptions.find(
                        (type) => type.value === row.firstHalfOfYear
                    ).label;
                    row.startDateParsed = dayjs(row.startDate);
                    row.endDateParsed = dayjs(row.endDate);
                    row.daysOffParsed = row.daysOff.map((day) => dayjs(day));
                    row.daysOffJoined = row.daysOff.join(", ");
                    return row;
                })
            ),
        handleApiError
    );

    useEffect(() => {
        if (
            academicYearsOptions.length !== 0 &&
            semesterTypesOptions.length !== 0
        )
            getYearOrganizationsRequest();
    }, [academicYearsOptions.length, semesterTypesOptions.length]);

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
                    valuesOnCreate={nextAcademicSemester}
                    title={{ edit: "Edytuj", create: "Utwórz" }}
                >
                    <FormItemSelect
                        label={t("academic-year")}
                        name="yearId"
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
                <TableWithActions
                    columns={columns}
                    rows={rows}
                    isLoading={isLoading}
                />
            </DrawerProvider>
        </ContentBlock>
    );
}
