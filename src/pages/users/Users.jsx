import ContentBlock from "../../components/ContentBlock.jsx";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Button,
    Flex,
    Input,
    Modal,
    notification,
    Skeleton,
    Space,
    Table,
    Typography
} from "antd";
import { ExclamationCircleFilled, SearchOutlined } from "@ant-design/icons";
import { deleteUser, getAllUsers } from "../../api/users.js";
import getNotificationConfig from "../../helpers/getNotificationConfig.js";
import EditUserDrawer from "./EditUserDrawer.jsx";
import { useDrawer } from "../../context/DrawerContext.jsx";

const { confirm } = Modal;
const { Text } = Typography;

function Users() {
    const { t } = useTranslation();
    const { openDrawer, setData, data } = useDrawer();
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);

    const [dataSource, setDataSource] = useState([]);

    const fetchAllUsers = useCallback(
        function () {
            getAllUsers().then((users) => {
                setDataSource(
                    users.data.map((user) => {
                        return {
                            key: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email
                        };
                    })
                );
            });
        },
        [setDataSource]
    );

    useEffect(() => {
        fetchAllUsers();
    }, [fetchAllUsers, data]);

    const removeUser = useCallback(
        async function (record) {
            try {
                await deleteUser(record.key);
                fetchAllUsers();
                notification.success(
                    getNotificationConfig(t("success-remove-user"))
                );
            } catch {
                notification.error(
                    getNotificationConfig(t("error-unexpected"))
                );
            }
        },
        [fetchAllUsers, t]
    );

    const showDeleteConfirm = useCallback(
        async function (record) {
            confirm({
                title: t("are-you-sure-you-want-to-remove-user"),
                icon: <ExclamationCircleFilled />,
                content: (
                    <>
                        {t("first-name")}:{" "}
                        <Text strong>{record.firstName}</Text> <br />
                        {t("last-name")}: <Text strong>{record.lastName}</Text>{" "}
                        <br />
                        {t("email")}: <Text strong>{record.email}</Text> <br />
                    </>
                ),
                okText: t("delete"),
                okType: "danger",
                cancelText: t("cancel"),
                async onOk() {
                    await removeUser(record);
                },
                onCancel() {}
            });
        },
        [t, removeUser]
    );

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters, confirm) => {
        clearFilters();
        setSearchText("");
        confirm();
    };

    const getColumnSearchProps = (dataIndex, searchInputText) => ({
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
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
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
                            clearFilters && handleReset(clearFilters, confirm)
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
    });

    const getColumnSortProps = (dataIndex) => {
        return {
            sorter: (a, b) =>
                a[dataIndex].charCodeAt(0) - b[dataIndex].charCodeAt(0),
            sortDirections: ["descend", "ascend"],
            showSorterTooltip: null
        };
    };

    const columns = useMemo(
        () => [
            {
                title: t("first-name"),
                dataIndex: "firstName"
            },
            {
                title: t("last-name"),
                dataIndex: "lastName",
                ...getColumnSearchProps("lastName", t("enter-last-name"))
            },
            {
                title: t("email"),
                dataIndex: "email",
                ...getColumnSearchProps("email", t("enter-email")),
                ...getColumnSortProps("email")
            },
            {
                title: t("actions"),
                key: "action",
                render: (_, record) => (
                    <Space size="middle">
                        <a
                            onClick={() => {
                                openDrawer();
                                setData({
                                    ...record,
                                    newPassword: "",
                                    repeatNewPassword: ""
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
            }
        ],
        [t, getColumnSearchProps, openDrawer, setData, showDeleteConfirm]
    );

    return (
        <ContentBlock breadcrumbs={[{ title: t("users") }]}>
            {dataSource.length === 0 ? (
                <Skeleton loading />
            ) : (
                <>
                    <EditUserDrawer />
                    <Flex gap="middle" vertical>
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                            scroll={{
                                x: "max-content"
                            }}
                        />
                    </Flex>
                </>
            )}
        </ContentBlock>
    );
}

export default Users;
