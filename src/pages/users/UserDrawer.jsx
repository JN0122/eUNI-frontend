import { Typography } from "antd";
import { DRAWER_TYPE, useDrawer } from "../../hooks/useDrawer.jsx";
import { useTranslation } from "react-i18next";
import { FormItemNewPasswords } from "../../components/form/FormItemNewPasswords.jsx";
import hashPassword from "../../helpers/hashPassword.js";
import { createUser, updateUser } from "../../api/admin.js";
import DataDrawer from "../../components/content/DataDrawer.jsx";
import USER_ROLE from "../../enums/userRoles.js";
import { FormItemInput } from "../../components/form/FormItemInput.jsx";
import { FormItemEmail } from "../../components/form/FormItemEmail.jsx";
import { FormItemSelect } from "../../components/form/FormItemSelect.jsx";
import { useCallback } from "react";

const { Title } = Typography;

function prepareCreateUserPayload(form) {
    return {
        firstName: form.getFieldValue("firstName"),
        lastName: form.getFieldValue("lastName"),
        email: form.getFieldValue("email"),
        roleId: form.getFieldValue("roleId"),
        representativeFieldsOfStudyLogIds: form.getFieldValue(
            "representativeFieldsOfStudyLogIds"
        ),
        password: form.getFieldValue("newPassword")
            ? hashPassword(form.getFieldValue("newPassword"))
            : null
    };
}

function prepareEditUserPayload(form) {
    const { password, ...rest } = prepareCreateUserPayload(form);
    return {
        ...rest,
        newPassword: password
    };
}

function UserDrawer({ fieldsOfStudyInfoOptions }) {
    const { data, type } = useDrawer();
    const { t } = useTranslation();

    const onCreate = useCallback(async function (form) {
        await createUser(prepareCreateUserPayload(form));
    }, []);

    const onEdit = useCallback(
        async function (form) {
            await updateUser(data?.key, prepareEditUserPayload(form));
        },
        [data?.key]
    );

    return (
        <>
            <DataDrawer
                width={650}
                title={{ create: t("create-user"), edit: t("edit-user") }}
                onCreate={onCreate}
                onEdit={onEdit}
            >
                <Title level={3}>{t("basic-info")}</Title>
                <FormItemInput
                    name="firstName"
                    label={t("first-name")}
                    placeholder={t("enter-first-name")}
                    isRequired={true}
                />
                <FormItemInput
                    name="lastName"
                    label={t("last-name")}
                    placeholder={t("enter-last-name")}
                    isRequired={true}
                />
                <FormItemInput
                    name="lastName"
                    label={t("last-name")}
                    placeholder={t("enter-last-name")}
                    isRequired={true}
                />
                <FormItemEmail
                    name="email"
                    label={t("email")}
                    placeholder={t("enter-email")}
                    isRequired={true}
                />
                <FormItemSelect
                    name="roleId"
                    label={t("role")}
                    options={[
                        { value: USER_ROLE.Admin, label: "Admin" },
                        {
                            value: USER_ROLE.Student,
                            label: "Student"
                        }
                    ]}
                    isRequired={true}
                />
                <FormItemSelect
                    name="representativeFieldsOfStudyLogIds"
                    label={t("representative-fields-of-study")}
                    mode="multiple"
                    popupMatchSelectWidth={false}
                    options={fieldsOfStudyInfoOptions}
                />
                <Title level={3}>{t("password")}</Title>
                <FormItemNewPasswords required={type === DRAWER_TYPE.create} />
            </DataDrawer>
        </>
    );
}

export default UserDrawer;
