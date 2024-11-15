import ContentBlock from "../../components/ContentBlock.jsx";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { Typography } from "antd";
import { deleteUser, getAllUsers } from "../../api/users.js";
import EditUserDrawer from "./EditUserDrawer.jsx";
import TableWithActions from "../../components/TableWithActions.jsx";

const { Text } = Typography;

function Users() {
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
                searchInputText: t("enter-last-name")
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
            <EditUserDrawer />
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
