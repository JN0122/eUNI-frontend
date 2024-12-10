import ContentBlockBreadcrumb from "../../components/content/ContentBlockBreadcrumb.jsx";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo, useState } from "react";
import { DrawerProvider } from "../../hooks/useDrawer.jsx";
import DrawerNewItemButton from "../../components/form/DrawerNewItemButton.jsx";
import ClassesDrawerForm from "../../components/form/forms/ClassesDrawerForm.jsx";
import TableWithActions from "../../components/content/TableWithActions.jsx";
import { Flex, Table } from "antd";
import LoadingButton from "../../components/form/LoadingButton.jsx";

export default function FieldsOfStudyCurrentList() {
    const { t } = useTranslation();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const upgradeRequirements = {
        year: "2024/2025",
        firstHalfOfYear: true
    };

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

    const rows = [
        {
            id: "1",
            key: "1",
            name: "Informatyka stosowana",
            studiesCycle: 1,
            studiesCycleParsed: t("studies-cycle-1"),
            fullTimeParsed: t("studies-are-full-time"),
            fullTime: true,
            currentSemester: 2,
            currentYear: "2024/2025",
            firstHalfOfYear: true,
            semesterType: t("winter-semester")
        }
    ];

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
                title: t("current-year"),
                dataIndex: "currentYear",
                filters: rows.map((row) => {
                    return { text: row.currentYear, value: row.currentYear };
                }),
                filterSearch: true,
                onFilter: (value, record) => record.currentYear.includes(value)
            },
            {
                title: t("semester-type"),
                dataIndex: "semesterType",
                filters: [
                    {
                        text: t("winter-semester"),
                        value: true
                    },
                    {
                        text: t("summer-semester"),
                        value: false
                    }
                ],
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
        [rows, t]
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
                <ClassesDrawerForm initialValues={rows[0]} />
                <TableWithActions
                    columns={columns}
                    rows={rows}
                    rowSelection={rowSelection}
                />
            </DrawerProvider>
        </ContentBlockBreadcrumb>
    );
}
