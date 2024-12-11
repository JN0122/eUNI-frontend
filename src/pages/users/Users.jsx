import ContentBlock from "../../components/content/ContentBlock.jsx";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Flex, Typography } from "antd";
import {
    createUser,
    deleteUser,
    getAllUsers,
    updateUser
} from "../../api/admin.js";
import TableWithActions from "../../components/content/TableWithActions.jsx";
import useFieldsOfStudyLogsOptions from "../../hooks/options/useFieldsOfStudyLogsOptions.js";
import DrawerNewItemButton from "../../components/form/DrawerNewItemButton.jsx";
import { useApiWithLoading } from "../../hooks/useApiWithLoading.js";
import { useNotification } from "../../hooks/useNotification.jsx";
import { useApi } from "../../hooks/useApi.js";
import hashPassword from "../../helpers/hashPassword.js";
import UserDrawerForm from "../../components/form/forms/UsersDrawerForm.jsx";
import { DrawerProvider } from "../../hooks/useDrawer.jsx";

const { Text } = Typography;

function prepareCreateUserPayload(values) {
    return {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        roleId: values.roleId,
        representativeFieldsOfStudyLogIds:
            values.representativeFieldsOfStudyLogIds,
        password: values.newPassword ? hashPassword(values.newPassword) : null
    };
}

function prepareEditUserPayload(values) {
    const { password, ...rest } = prepareCreateUserPayload(values);
    return {
        ...rest,
        newPassword: password
    };
}

function Users() {
    const { t } = useTranslation();
    const fieldsOfStudyInfoOptions = useFieldsOfStudyLogsOptions();
    const { handleApiError, displayNotification } = useNotification();
    const [rows, setRows] = useState([]);
    const [selectedRow, setSelectedRow] = useState({});

    const renderModalContent = useCallback(
        (row) => (
            <>
                {t("first-name")}: <Text strong>{row.firstName}</Text> <br />
                {t("last-name")}: <Text strong>{row.lastName}</Text> <br />
                {t("email")}: <Text strong>{row.email}</Text> <br />
            </>
        ),
        [t]
    );

    const createUseRequest = useApi(
        createUser,
        () => getUsersRequest(),
        handleApiError
    );

    const handleCreate = useCallback(
        function (values) {
            createUseRequest(prepareCreateUserPayload(values));
        },
        [createUseRequest]
    );

    const updateUserUpdate = useApi(
        updateUser,
        () => getUsersRequest(),
        handleApiError
    );

    const handleEdit = useCallback(
        function (values) {
            updateUserUpdate(values.id, prepareEditUserPayload(values));
        },
        [updateUserUpdate]
    );

    const deleteClassRequest = useApi(
        deleteUser,
        () => {
            displayNotification(t("success-remove-user"));
            getUsersRequest();
        },
        handleApiError
    );

    const rowsWithFieldsOfStudy = useMemo(() => {
        return rows.map((value) => {
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
    }, [fieldsOfStudyInfoOptions, rows]);

    const [getUsersRequest, isLoading] = useApiWithLoading(
        getAllUsers,
        (data) =>
            setRows(
                data.map((row) => {
                    row.key = row.id;
                    return row;
                })
            ),
        handleApiError
    );

    useEffect(() => {
        getUsersRequest();
    }, []);

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

    return (
        <ContentBlock breadcrumbs={[{ title: t("users") }]}>
            <DrawerProvider>
                <Flex
                    gap="small"
                    style={{
                        paddingBottom: "1rem",
                        flexDirection: "row-reverse"
                    }}
                >
                    <DrawerNewItemButton label={t("create-user")} />
                </Flex>
                <UserDrawerForm
                    fieldsOfStudyInfoOptions={fieldsOfStudyInfoOptions}
                    onEdit={handleEdit}
                    onCreate={handleCreate}
                    valuesOnEdit={selectedRow}
                />
                <TableWithActions
                    columns={columns}
                    rows={rowsWithFieldsOfStudy}
                    loading={isLoading}
                    modalRenderConfirmContent={renderModalContent}
                    onDelete={(row) => deleteClassRequest(row.id)}
                    onEdit={(row) => setSelectedRow(row)}
                />
            </DrawerProvider>
        </ContentBlock>
    );
}

export default Users;
