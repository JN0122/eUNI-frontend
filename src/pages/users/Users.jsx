import ContentBlock from "../../components/ContentBlock.jsx";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Flex, Modal, notification, Skeleton, Space, Table } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { getAllUsers } from "../../api/users.js";
import getNotificationConfig from "../../helpers/getNotificationConfig.js";

const { confirm } = Modal;

function Users() {
    const { t } = useTranslation();

    const [dataSource, setDataSource] = useState([]);

    function showDeleteConfirm(record) {
        confirm({
            title: t("are-you-sure-you-want-to-remove-user"),
            icon: <ExclamationCircleFilled />,
            content: (
                <>
                    {t("first-name")}: {record.firstName} <br />
                    {t("last-name")}: {record.lastName} <br />
                    {t("email")}: {record.email} <br />
                </>
            ),
            okText: t("delete"),
            okType: "danger",
            cancelText: t("cancel"),
            onOk() {
                try {
                    notification.success(getNotificationConfig(record.key));
                } catch {
                    notification.error(
                        getNotificationConfig(t("error-unexpected")),
                    );
                }
            },
            onCancel() {},
        });
    }

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
                        <a>{t("edit")}</a>
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
        [t],
    );

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
    }, [fetchAllUsers]);

    return (
        <ContentBlock breadcrumbs={[{ title: t("users") }]}>
            {dataSource.length === 0 ? (
                <Skeleton loading />
            ) : (
                <Flex gap="middle" vertical>
                    <Table columns={columns} dataSource={dataSource} />
                </Flex>
            )}
        </ContentBlock>
    );
}

export default Users;
