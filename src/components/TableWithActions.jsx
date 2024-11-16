import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { App, Button, Flex, Input, Skeleton, Space, Table } from "antd";
import { ExclamationCircleFilled, SearchOutlined } from "@ant-design/icons";
import getNotificationConfig from "../helpers/getNotificationConfig.js";
import { useDrawer } from "../context/DrawerContext.jsx";

const getColumnSortProps = (dataIndex) => {
    return {
        sorter: (a, b) =>
            a[dataIndex].charCodeAt(0) - b[dataIndex].charCodeAt(0),
        sortDirections: ["descend", "ascend"],
        showSorterTooltip: null
    };
};

function TableWithActions({
    columns,
    fetchData,
    modalConfirmContent,
    onModalConfirm,
    notificationSuccessText
}) {
    const { t } = useTranslation();
    const { openUpdateDrawer, setData, data } = useDrawer();
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(true);
    const searchInput = useRef(null);
    const { notification, modal } = App.useApp();

    const getDataSource = useCallback(
        async function () {
            setLoading(true);
            const response = await fetchData();

            if (response.status !== 200)
                return notification.error(
                    getNotificationConfig(t("error-could-not-connect-to-api"))
                );
            setDataSource(
                response.data.map((user) => {
                    const { id, ...rest } = user;
                    return {
                        ...rest,
                        key: id
                    };
                })
            );
            setLoading(false);
        },
        [fetchData, notification, t]
    );

    useEffect(() => {
        if (data === null) getDataSource();
    }, [getDataSource, data]);

    const handleModalConfirm = useCallback(
        async function (record) {
            try {
                await onModalConfirm(record);
                await getDataSource();
                notification.success(
                    getNotificationConfig(notificationSuccessText)
                );
            } catch {
                notification.error(
                    getNotificationConfig(t("error-unexpected"))
                );
            }
        },
        [
            getDataSource,
            notification,
            notificationSuccessText,
            onModalConfirm,
            t
        ]
    );

    const showDeleteConfirm = useCallback(
        function (record) {
            modal.confirm({
                title: t("delete-are-you-sure"),
                icon: <ExclamationCircleFilled />,
                content: modalConfirmContent(record),
                okText: t("delete"),
                okType: "danger",
                cancelText: t("cancel"),
                onOk() {
                    handleModalConfirm(record);
                },
                onCancel() {}
            });
        },
        [handleModalConfirm, modal, modalConfirmContent, t]
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
            let additionalProps = {};
            if (column?.withSearch)
                additionalProps = {
                    ...additionalProps,
                    ...getColumnSearchProps(
                        column.dataIndex,
                        column?.searchInputText
                    )
                };
            if (column?.withSort)
                additionalProps = {
                    ...additionalProps,
                    ...getColumnSortProps(column.dataIndex)
                };
            return {
                title: column.title,
                dataIndex: column.dataIndex,
                ...additionalProps
            };
        });
        newColumns.push({
            title: t("actions"),
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <a
                        onClick={() => {
                            openUpdateDrawer();
                            setData({
                                ...record
                            });
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
        openUpdateDrawer,
        setData,
        showDeleteConfirm,
        t
    ]);

    if (dataSource?.length === 0) {
        return <Skeleton loading />;
    }
    return (
        <>
            <Flex gap="middle" vertical>
                <Table
                    columns={parsedColumns}
                    loading={loading}
                    dataSource={dataSource}
                    scroll={{
                        x: "max-content"
                    }}
                />
            </Flex>
        </>
    );
}

export default TableWithActions;
