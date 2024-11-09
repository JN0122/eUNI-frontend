import ContentBlock from "../../components/ContentBlock.jsx";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Flex,
    Modal,
    notification,
    Skeleton,
    Space,
    Table,
    Typography,
} from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { deleteUser, getAllUsers } from "../../api/users.js";
import getNotificationConfig from "../../helpers/getNotificationConfig.js";
import EditUserDrawer from "./EditUserDrawer.jsx";
import { useDrawer } from "../../context/DrawerContext.jsx";

const { confirm } = Modal;
const { Text } = Typography;

function Users() {
    const { t } = useTranslation();
    const { openDrawer, setData, data } = useDrawer();

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
                            email: user.email,
                        };
                    }),
                );
            });
        },
        [setDataSource],
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
                    getNotificationConfig(t("success-remove-user")),
                );
            } catch {
                notification.error(
                    getNotificationConfig(t("error-unexpected")),
                );
            }
        },
        [fetchAllUsers, t],
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
                onCancel() {},
            });
        },
        [t, removeUser],
    );

    const columns = useMemo(
        () => [
            {
                title: t("first-name"),
                dataIndex: "firstName",
            },
            {
                title: t("last-name"),
                dataIndex: "lastName",
            },
            {
                title: t("email"),
                dataIndex: "email",
            },
            {
                title: t("actions"),
                key: "action",
                render: (_, record) => (
                    <Space size="middle">
                        <a
                            onClick={() => {
                                openDrawer();
                                setData(record);
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
                ),
            },
        ],
        [t, showDeleteConfirm],
    );

    return (
        <ContentBlock breadcrumbs={[{ title: t("users") }]}>
            {dataSource.length === 0 ? (
                <Skeleton loading />
            ) : (
                <>
                    <EditUserDrawer />
                    <Flex gap="middle" vertical>
                        <Table columns={columns} dataSource={dataSource} />
                    </Flex>
                </>
            )}
        </ContentBlock>
    );
}

export default Users;
