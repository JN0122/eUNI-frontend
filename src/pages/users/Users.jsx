import ContentBlock from "../../components/ContentBlock.jsx";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { App, Button, Flex, Typography } from "antd";
import { deleteUser, getAllUsers } from "../../api/admin.js";
import UserDrawer from "./UserDrawer.jsx";
import TableWithActions from "../../components/TableWithActions.jsx";
import { useDrawer } from "../../hooks/useDrawer.jsx";
import { getFieldsOfStudyLogs } from "../../api/fieldOfStudy.js";
import getNotificationConfig from "../../helpers/getNotificationConfig.js";

const { Text } = Typography;

function Users() {
    const { openCreateDrawer } = useDrawer();
    const { t } = useTranslation();
    const [fieldsOfStudyInfoOptions, setFieldsOfStudyInfoOptions] =
        useState(null);
    const { notification } = App.useApp();

    const fetchFieldsOfStudyLogs = useCallback(
        async function () {
            try {
                const response = await getFieldsOfStudyLogs();
                setFieldsOfStudyInfoOptions(
                    response.data.map((fieldOfStudy) => {
                        return {
                            label: [
                                fieldOfStudy.yearName,
                                t(`studies-cycle-${fieldOfStudy.studiesCycle}`),
                                fieldOfStudy.isFullTime
                                    ? t("full-time-field-of-study")
                                    : t("part-time-field-of-study"),
                                fieldOfStudy.name,
                                `${t("semester")} ${fieldOfStudy.semester}`
                            ].join(" > "),
                            value: fieldOfStudy.fieldOfStudyLogId
                        };
                    })
                );
            } catch (err) {
                notification.error(
                    getNotificationConfig(t("error-unexpected"))
                );
                console.error(err.message);
            }
        },
        [notification, t]
    );

    const modalConfirmContent = (record) => (
        <>
            {t("first-name")}: <Text strong>{record.firstName}</Text> <br />
            {t("last-name")}: <Text strong>{record.lastName}</Text> <br />
            {t("email")}: <Text strong>{record.email}</Text> <br />
        </>
    );

    const removeUser = async function (record) {
        await deleteUser(record.key);
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
                withSearch: true,
                searchInputText: t("enter-last-name"),
                withSort: true,
                defaultSortOrder: "ascend"
            },
            {
                title: t("email"),
                dataIndex: "email",
                withSearch: true,
                searchInputText: t("enter-email"),
                withSort: true
            },
            {
                title: t("representative-fields-of-study"),
                dataIndex: "representativeFieldsOfStudy",
                width: 400,
                withSearch: true,
                searchInputText: t("enter-info")
            }
        ],
        [t]
    );

    const fetchUsers = useCallback(
        async function () {
            if (fieldsOfStudyInfoOptions === null)
                new Promise(() => Promise.resolve());
            const response = await getAllUsers();
            response.data = response.data.map((value) => {
                value.representativeFieldsOfStudy =
                    value.representativeFieldsOfStudyLogIds
                        .map(
                            (id) =>
                                fieldsOfStudyInfoOptions?.find(
                                    (f) => f.value === id
                                )?.label
                        )
                        .join(", ");
                return value;
            });
            return response;
        },
        [fieldsOfStudyInfoOptions]
    );

    useEffect(() => {
        fetchFieldsOfStudyLogs();
    }, [fetchFieldsOfStudyLogs]);

    return (
        <ContentBlock breadcrumbs={[{ title: t("users") }]}>
            <Flex
                gap="small"
                style={{ paddingBottom: "1rem", flexDirection: "row-reverse" }}
            >
                <Button type={"primary"} onClick={() => openCreateDrawer()}>
                    {t("create-user")}
                </Button>
            </Flex>
            {fieldsOfStudyInfoOptions && (
                <UserDrawer
                    fieldsOfStudyInfoOptions={fieldsOfStudyInfoOptions}
                />
            )}
            <TableWithActions
                columns={columns}
                fetchData={fetchUsers}
                modalConfirmContent={modalConfirmContent}
                onModalConfirm={removeUser}
                notificationSuccessText={t("success-remove-user")}
            />
        </ContentBlock>
    );
}

export default Users;
