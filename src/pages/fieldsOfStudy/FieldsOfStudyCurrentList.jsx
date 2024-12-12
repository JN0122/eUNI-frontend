import ContentBlockBreadcrumb from "../../components/content/ContentBlockBreadcrumb.jsx";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DrawerProvider } from "../../hooks/useDrawer.jsx";
import DrawerNewItemButton from "../../components/form/DrawerNewItemButton.jsx";
import TableWithActions from "../../components/content/TableWithActions.jsx";
import { Flex, Table, Typography } from "antd";
import LoadingButton from "../../components/form/LoadingButton.jsx";
import useFieldOfStudyUpgradeRequirements from "../../hooks/options/useFieldOfStudyUpgradeRequirements.js";
import useStudiesCycleOptions from "../../hooks/options/useStudiesCycleOptions.js";
import useModeOfStudyOptions from "../../hooks/options/useModeOfStudyOptions.js";
import useSemesterTypesOptions from "../../hooks/options/useSemesterTypesOptions.js";
import FieldsOfStudyCurrentListForm from "../../components/form/forms/FieldsOfStudyCurrentListForm.jsx";
import { useApiWithLoading } from "../../hooks/useApiWithLoading.js";
import { useNotification } from "../../hooks/useNotification.jsx";
import { getFieldsOfStudyLogs } from "../../api/fieldOfStudy.js";
import {
    createFieldOfStudyLog,
    deleteFieldOfStudyLog,
    upgradeFieldOfStudyLog
} from "../../api/admin.js";
import { useApi } from "../../hooks/useApi.js";

const { Text } = Typography;

const preparePayload = function (data) {
    return {
        fieldOfStudyId: data.fieldOfStudyId,
        organizationId: data.organizationId,
        currentSemester: data.currentSemester
    };
};

export default function FieldsOfStudyCurrentList() {
    const { t } = useTranslation();
    const { handleApiError } = useNotification();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [rows, setRows] = useState([]);
    const studiesCycle = useStudiesCycleOptions();
    const modeOfStudy = useModeOfStudyOptions();
    const upgradeRequirements = useFieldOfStudyUpgradeRequirements();
    const semesterTypes = useSemesterTypesOptions();

    const renderModalContent = useCallback(
        (row) => (
            <>
                {`${t("academic-year")}: `}
                <Text strong>{row.yearName}</Text>
                <br />
                {`${t("semester-type")}: `}
                <Text strong>{row.firstHalfOfYearParsed}</Text>
                <br />
                {`${t("fields-name")}: `}
                <Text strong>{row.name}</Text> <br />
                {`${t("studies-cycle")}: `}
                <Text strong>{row.studiesCycleParsed}</Text>
                <br />
                {`${t("current-semester")}: `}
                <Text strong>{row.semester}</Text>
                <br />
                {`${t("studies-full-time")}: `}
                <Text strong>{row.fullTimeParsed}</Text> <br />
            </>
        ),
        [t]
    );

    const upgradeFieldOfStudyLogRequest = useApi(
        upgradeFieldOfStudyLog,
        () => getCurrentFieldsOfStudyRequest(),
        handleApiError
    );

    const handleUpgrade = function () {
        upgradeFieldOfStudyLogRequest({
            fieldOfStudyLogIds: selectedRowKeys
        }).then(() => setSelectedRowKeys([]));
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys) =>
            setSelectedRowKeys(newSelectedRowKeys),
        selections: [
            Table.SELECTION_NONE,
            {
                key: "yearName",
                text: t("select-valid-position-to-upgrade"),
                onSelect: (changeableRowKeys) =>
                    setSelectedRowKeys(
                        changeableRowKeys.filter(checkIfFieldCanBeUpgraded)
                    )
            }
        ]
    };

    const [getCurrentFieldsOfStudyRequest, isLoading] = useApiWithLoading(
        getFieldsOfStudyLogs,
        (data) =>
            setRows(
                data.map((row) => {
                    row.key = row.fieldOfStudyLogId;
                    row.studiesCycleParsed = studiesCycle.find(
                        (value) => value.value === row.studiesCycle
                    ).label;
                    row.fullTime = row.isFullTime.toString();
                    row.fullTimeParsed = modeOfStudy.find(
                        (value) => value.value === row.fullTime
                    ).label;
                    row.firstHalfOfYear = row.firstHalfOfYear.toString();
                    row.firstHalfOfYearParsed = semesterTypes.find(
                        (value) => value.value === row.firstHalfOfYear
                    ).label;
                    return row;
                })
            ),
        handleApiError
    );

    useEffect(() => {
        getCurrentFieldsOfStudyRequest();
    }, []);

    const checkIfFieldCanBeUpgraded = useCallback(
        function (key) {
            const row = rows.find((row) => row.key === key);
            return (
                row?.yearId === upgradeRequirements?.yearId &&
                JSON.parse(row?.firstHalfOfYear) ===
                    upgradeRequirements?.firstHalfOfYear
            );
        },
        [
            rows,
            upgradeRequirements?.firstHalfOfYear,
            upgradeRequirements?.yearId
        ]
    );

    const createFieldOfStudyLogRequest = useApi(
        createFieldOfStudyLog,
        () => getCurrentFieldsOfStudyRequest(),
        handleApiError
    );

    const deleteFieldOfStudyLogRequest = useApi(
        deleteFieldOfStudyLog,
        () => getCurrentFieldsOfStudyRequest(),
        handleApiError
    );

    const columns = useMemo(
        () => [
            {
                title: t("academic-year"),
                dataIndex: "yearName",
                filters: rows.map((row) => {
                    return { text: row.yearName, value: row.yearName };
                }),
                filterSearch: true,
                onFilter: (value, record) => record.yearName.includes(value)
            },
            {
                title: t("semester-type"),
                dataIndex: "firstHalfOfYearParsed",
                filters: semesterTypes.map((type) =>
                    Object.create({
                        text: type.label,
                        value: type.value
                    })
                ),
                filterSearch: true,
                onFilter: (value, record) => record.firstHalfOfYear === value
            },
            {
                title: t("fields-name"),
                dataIndex: "name"
            },
            {
                title: t("studies-cycle"),
                dataIndex: "studiesCycleParsed"
            },
            {
                title: t("studies-full-time"),
                dataIndex: "fullTimeParsed"
            },
            {
                title: t("current-semester"),
                dataIndex: "semester"
            }
        ],
        [rows, semesterTypes, t]
    );
    const hasSelected =
        selectedRowKeys.length > 0 &&
        selectedRowKeys.every(checkIfFieldCanBeUpgraded);

    return (
        <ContentBlockBreadcrumb currentPath={t("fields-current-list")}>
            <DrawerProvider>
                <Flex
                    gap="small"
                    style={{
                        paddingBottom: "1rem",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}
                >
                    <LoadingButton
                        type="primary"
                        onClick={handleUpgrade}
                        disabled={!hasSelected}
                    >
                        {t("move-to-next-semester")}
                    </LoadingButton>
                    <DrawerNewItemButton label={t("add-field-of-study")} />
                </Flex>
                <FieldsOfStudyCurrentListForm
                    onCreate={(row) =>
                        createFieldOfStudyLogRequest(preparePayload(row))
                    }
                />
                <TableWithActions
                    columns={columns}
                    rows={rows}
                    loading={isLoading}
                    rowSelection={rowSelection}
                    withoutEdit={true}
                    onDelete={(row) =>
                        deleteFieldOfStudyLogRequest(row.fieldOfStudyLogId)
                    }
                    modalRenderConfirmContent={renderModalContent}
                />
            </DrawerProvider>
        </ContentBlockBreadcrumb>
    );
}
