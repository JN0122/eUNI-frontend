import { useTranslation } from "react-i18next";
import { useCallback, useMemo, useRef } from "react";
import { Button, Flex, Input, Space, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDrawer } from "../../hooks/useDrawer.jsx";
import { useNotification } from "../../hooks/useNotification.jsx";
import { MODAL_TYPES } from "../../enums/NotificationTypes.js";

const getColumnSortProps = (dataIndex) => {
    return {
        sorter: (a, b) =>
            a[dataIndex].toLocaleLowerCase().charCodeAt(0) -
            b[dataIndex].toLocaleLowerCase().charCodeAt(0),
        sortDirections: ["descend", "ascend"],
        showSorterTooltip: null
    };
};

function TableWithActions({
    columns,
    rows,
    modalRenderConfirmContent,
    onDelete,
    onEdit,
    ...rest
}) {
    const { t } = useTranslation();
    const { openEditDrawer } = useDrawer();
    const searchInput = useRef(null);
    const { displayConfirmModal } = useNotification();

    const showDeleteConfirm = useCallback(
        function (record) {
            displayConfirmModal(
                modalRenderConfirmContent(record),
                MODAL_TYPES.delete,
                () => onDelete(record)
            );
        },
        [displayConfirmModal, modalRenderConfirmContent, onDelete]
    );

    const handleSearch = (selectedKeys, confirm) => {
        confirm();
    };

    const handleReset = (clearFilters, confirm) => {
        clearFilters();
        confirm();
    };

    const getColumnSearchProps = useCallback(
        (dataIndex, searchInputText) => ({
            filterDropdown: ({
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters
            }) => (
                <div
                    style={{
                        padding: 8
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                >
                    <Input
                        ref={searchInput}
                        placeholder={searchInputText}
                        value={selectedKeys[0]}
                        onChange={(e) =>
                            setSelectedKeys(
                                e.target.value ? [e.target.value] : []
                            )
                        }
                        onPressEnter={() =>
                            handleSearch(selectedKeys, confirm, dataIndex)
                        }
                        style={{
                            marginBottom: 8,
                            display: "block"
                        }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() =>
                                handleSearch(selectedKeys, confirm, dataIndex)
                            }
                            icon={<SearchOutlined />}
                            size="small"
                            style={{
                                width: 90
                            }}
                        >
                            {t("search")}
                        </Button>
                        <Button
                            onClick={() =>
                                clearFilters &&
                                handleReset(clearFilters, confirm)
                            }
                            size="small"
                            style={{
                                width: 90
                            }}
                        >
                            {t("reset")}
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered) => (
                <SearchOutlined
                    style={{
                        color: filtered ? "#1677ff" : undefined
                    }}
                />
            ),
            onFilter: (value, record) =>
                record[dataIndex]
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
            filterDropdownProps: {
                onOpenChange(open) {
                    if (open) {
                        setTimeout(() => searchInput.current?.select(), 100);
                    }
                }
            }
        }),
        [t]
    );

    const parsedColumns = useMemo(() => {
        const newColumns = columns.map((column) => {
            const {
                withSearch,
                searchInputText = "",
                withSort,
                ...rest
            } = column;
            let additionalProps = {};
            if (withSearch)
                additionalProps = {
                    ...getColumnSearchProps(column.dataIndex, searchInputText)
                };
            if (withSort)
                additionalProps = {
                    ...additionalProps,
                    ...getColumnSortProps(column.dataIndex)
                };
            return {
                ...additionalProps,
                ...rest
            };
        });
        newColumns.push({
            title: t("actions"),
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <a
                        onClick={() => {
                            openEditDrawer();
                            onEdit(record);
                        }}
                    >
                        {t("edit")}
                    </a>
                    <a
                        style={{ color: "red" }}
                        onClick={() => showDeleteConfirm(record)}
                    >
                        {t("delete")}
                    </a>
                </Space>
            )
        });
        return newColumns;
    }, [
        columns,
        getColumnSearchProps,
        onEdit,
        openEditDrawer,
        showDeleteConfirm,
        t
    ]);

    return (
        <>
            <Flex gap="middle" vertical>
                <Table
                    columns={parsedColumns}
                    dataSource={rows}
                    scroll={{
                        x: "max-content"
                    }}
                    {...rest}
                />
            </Flex>
        </>
    );
}

export default TableWithActions;
