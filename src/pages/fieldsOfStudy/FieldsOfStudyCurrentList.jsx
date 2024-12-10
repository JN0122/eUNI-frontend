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

const { Text } = Typography;

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
                {`${t("current-year")}: `}
                <Text strong>{row.currentYear}</Text>
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
                <Text strong>{row.currentSemester}</Text>
                <br />
                {`${t("studies-full-time")}: `}
                <Text strong>{row.fullTimeParsed}</Text> <br />
            </>
        ),
        [t]
    );

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys) =>
            setSelectedRowKeys(newSelectedRowKeys),
        selections: [
            Table.SELECTION_NONE,
            {
                key: "currentYear",
                text: t("select-valid-position-to-upgrade"),
                onSelect: (changeableRowKeys) =>
                    setSelectedRowKeys(
                        changeableRowKeys.filter(checkIfFieldCanBeUpgraded)
                    )
            }
        ]
    };

    const [getCurrentFieldsOfStudyRequest, isLoading] = useApiWithLoading(
        () => {},
        () =>
            setRows(
                [
                    {
                        id: "1",
                        key: "1",
                        name: "Informatyka stosowana",
                        studiesCycle: 1,
                        studiesCycleParsed: studiesCycle.find(
                            (value) => value.value === 1
                        ).label,
                        fullTime: true.toString(),
                        fullTimeParsed: modeOfStudy.find(
                            (value) => value.value === true.toString()
                        ).label,
                        currentSemester: 2,
                        currentYear: "2024/2025",
                        firstHalfOfYear: true.toString(),
                        firstHalfOfYearParsed: t("winter-semester")
                    }
                ]
                // data.map((row) => {
                //     row.key = row.id;
                //     return row;
                // })
            ),
        handleApiError
    );

    useEffect(() => {
        getCurrentFieldsOfStudyRequest();
    }, []);

    const checkIfFieldCanBeUpgraded = useCallback(
        function (value, index) {
            return (
                rows[index].currentYear === upgradeRequirements.year &&
                rows[index].firstHalfOfYear ===
                    upgradeRequirements.firstHalfOfYear
            );
        },
        [rows, upgradeRequirements.firstHalfOfYear, upgradeRequirements.year]
    );

    const columns = useMemo(
        () => [
            {
                title: t("academic-year"),
                dataIndex: "currentYear",
                filters: rows.map((row) => {
                    return { text: row.currentYear, value: row.currentYear };
                }),
                filterSearch: true,
                onFilter: (value, record) => record.currentYear.includes(value)
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
                dataIndex: "currentSemester"
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
                        onClick={() => setSelectedRowKeys([])}
                        disabled={!hasSelected}
                    >
                        {t("move-to-next-semester")}
                    </LoadingButton>
                    <DrawerNewItemButton label={t("add-field-of-study")} />
                </Flex>
                <FieldsOfStudyCurrentListForm
                    onCreate={(row) => console.log(row)}
                />
                <TableWithActions
                    columns={columns}
                    rows={rows}
                    loading={isLoading}
                    rowSelection={rowSelection}
                    withoutEdit={true}
                    modalRenderConfirmContent={renderModalContent}
                />
            </DrawerProvider>
        </ContentBlockBreadcrumb>
    );
}
