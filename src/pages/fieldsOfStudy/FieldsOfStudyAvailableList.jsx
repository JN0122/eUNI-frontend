import { useTranslation } from "react-i18next";
import ContentBlockBreadcrumb from "../../components/content/ContentBlockBreadcrumb.jsx";
import DrawerNewItemButton from "../../components/form/DrawerNewItemButton.jsx";
import TableWithActions from "../../components/content/TableWithActions.jsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DrawerProvider } from "../../hooks/useDrawer.jsx";
import { Flex, Typography } from "antd";
import AvailableFieldsOfStudyForm from "../../components/form/forms/AvailableFieldsOfStudyForm.jsx";
import { useNotification } from "../../hooks/useNotification.jsx";
import { useApiWithLoading } from "../../hooks/useApiWithLoading.js";
import useStudiesCycleOptions from "../../hooks/options/useStudiesCycleOptions.js";
import useModeOfStudyOptions from "../../hooks/options/useModeOfStudyOptions.js";
import { getAvailableFields } from "../../api/admin.js";

const { Text } = Typography;

export default function FieldsOfStudyAvailableList() {
    const { t } = useTranslation();
    const { handleApiError } = useNotification();
    const studiesCycle = useStudiesCycleOptions();
    const modeOfStudy = useModeOfStudyOptions();
    const [rows, setRows] = useState([]);
    const [selectedRow, setSelectedRow] = useState({});

    const renderModalContent = useCallback(
        (row) => (
            <>
                {`${t("fields-name")}: `}
                <Text strong>{row.name}</Text> <br />
                {`${t("studies-cycle")}: `}
                <Text strong>{row.studiesCycleParsed}</Text>
                <br />
                {`${t("semester-count")}: `}
                <Text strong>{row.semesterCount}</Text>
                <br />
                {`${t("studies-full-time")}: `}
                <Text strong>{row.fullTimeParsed}</Text> <br />
            </>
        ),
        [t]
    );

    const [getAvailableFieldsOfStudyRequest, isLoading] = useApiWithLoading(
        getAvailableFields,
        (data) =>
            setRows(
                data.map((row) => {
                    row.key = row.id;
                    row.studiesCycleParsed = studiesCycle.find(
                        (value) => value.value === row.studiesCycle
                    ).label;
                    row.fullTime = row.fullTime.toString();
                    row.fullTimeParsed = modeOfStudy.find(
                        (value) => value.value === row.fullTime
                    ).label;
                    return row;
                })
            ),
        handleApiError
    );

    useEffect(() => {
        if (studiesCycle.length !== 0 && modeOfStudy.length !== 0)
            getAvailableFieldsOfStudyRequest();
    }, []);

    const columns = useMemo(
        () => [
            {
                title: t("fields-name"),
                dataIndex: "name"
            },
            {
                title: t("abbr"),
                dataIndex: "abbr"
            },
            {
                title: t("studies-cycle"),
                dataIndex: "studiesCycleParsed"
            },
            {
                title: t("semester-count"),
                dataIndex: "semesterCount"
            },
            {
                title: t("studies-full-time"),
                dataIndex: "fullTimeParsed"
            }
        ],
        [t]
    );

    return (
        <ContentBlockBreadcrumb currentPath={t("available-fields")}>
            <DrawerProvider>
                <Flex
                    gap="small"
                    style={{
                        paddingBottom: "1rem",
                        flexDirection: "row-reverse"
                    }}
                >
                    <DrawerNewItemButton label={t("create-field-of-study")} />
                </Flex>
                <AvailableFieldsOfStudyForm
                    onEdit={() => {}}
                    onCreate={() => {}}
                    valuesOnEdit={selectedRow}
                />
                <TableWithActions
                    columns={columns}
                    rows={rows}
                    loading={isLoading}
                    modalRenderConfirmContent={renderModalContent}
                    onDelete={(row) => console.log(row)}
                    onEdit={(row) => setSelectedRow(row)}
                />
            </DrawerProvider>
        </ContentBlockBreadcrumb>
    );
}
