import ContentBlock from "../../components/ContentBlock.jsx";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { Button, Flex, Typography } from "antd";
import { deleteUser, getAllUsers } from "../../api/admin.js";
import UserDrawer from "./UserDrawer.jsx";
import TableWithActions from "../../components/TableWithActions.jsx";
import { useDrawer } from "../../context/DrawerContext.jsx";

const { Text } = Typography;

function Users() {
    const { openCreateDrawer } = useDrawer();
    const { t } = useTranslation();

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
            }
        ],
        [t]
    );

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
            <UserDrawer />
            <TableWithActions
                columns={columns}
                fetchData={getAllUsers}
                modalConfirmContent={modalConfirmContent}
                onModalConfirm={removeUser}
                notificationSuccessText={t("success-remove-user")}
            />
        </ContentBlock>
    );
}

export default Users;
