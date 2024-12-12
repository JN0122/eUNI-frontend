import { DrawerProvider } from "../../hooks/useDrawer.jsx";
import DrawerNewItemButton from "../../components/form/DrawerNewItemButton.jsx";
import ContentBlock from "../../components/content/ContentBlock.jsx";
import { useTranslation } from "react-i18next";
import TableWithActions from "../../components/content/TableWithActions.jsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Flex, Typography } from "antd";
import useAcademicYears from "../../hooks/options/useAcademicYears.js";
import useSemesterTypesOptions from "../../hooks/options/useSemesterTypesOptions.js";
import useNextAcademicSemester from "../../hooks/options/useNextAcademicSemester.js";
import {
    createYearOrganization,
    deleteYearOrganization,
    getYearOrganizations,
    updateYearOrganization
} from "../../api/admin.js";
import { useApiWithLoading } from "../../hooks/useApiWithLoading.js";
import { useNotification } from "../../hooks/useNotification.jsx";
import YearOrganizationForm from "../../components/form/forms/YearOrganizationForm.jsx";
import { useApi } from "../../hooks/useApi.js";

const { Text } = Typography;

const preparePayload = function (data) {
    return {
        startDate: data.startDateParsed.format("YYYY-MM-DD"),
        endDate: data.endDateParsed.format("YYYY-MM-DD"),
        daysOff:
            data.daysOffParsed?.map((day) => day.format("YYYY-MM-DD")) || []
    };
};

export default function YearOrganization() {
    const { t } = useTranslation();
    const { handleApiError } = useNotification();
    const academicYearsOptions = useAcademicYears();
    const semesterTypesOptions = useSemesterTypesOptions();
    const nextAcademicSemester = useNextAcademicSemester();

    const [rows, setRows] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);

    const renderModalContent = useCallback(
        (row) => (
            <>
                {t("academic-year")}: <Text strong>{row.yearName}</Text> <br />
                {t("semester-type")}: <Text strong>{row.semesterType}</Text>{" "}
                <br />
                {t("start-date")}: <Text strong>{row.startDate}</Text> <br />
                {t("end-date")}: <Text strong>{row.endDate}</Text> <br />
            </>
        ),
        [t]
    );

    const [getYearOrganizationsRequest, isLoading] = useApiWithLoading(
        getYearOrganizations,
        (data) =>
            setRows(
                data.map((row) => {
                    row.key = row.id;
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

    const createYearOrganizationsRequest = useApi(
        createYearOrganization,
        () => getYearOrganizationsRequest(),
        handleApiError
    );

    const deleteYearOrganizationRequest = useApi(
        deleteYearOrganization,
        () => getYearOrganizationsRequest(),
        handleApiError
    );

    const updateYearOrganizationRequest = useApi(
        updateYearOrganization,
        () => getYearOrganizationsRequest(),
        handleApiError
    );

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
                <YearOrganizationForm
                    semesterTypesOptions={semesterTypesOptions}
                    academicYearsOptions={academicYearsOptions}
                    valuesOnEdit={selectedRow}
                    valuesOnCreate={nextAcademicSemester}
                    onEdit={(data) => {
                        updateYearOrganizationRequest(
                            data.id,
                            preparePayload(data)
                        );
                    }}
                    onCreate={(data) => {
                        createYearOrganizationsRequest(preparePayload(data));
                    }}
                />
                <TableWithActions
                    columns={columns}
                    rows={rows}
                    isLoading={isLoading}
                    modalRenderConfirmContent={renderModalContent}
                    onEdit={(row) => setSelectedRow(row)}
                    onDelete={(row) => deleteYearOrganizationRequest(row.id)}
                />
            </DrawerProvider>
        </ContentBlock>
    );
}
