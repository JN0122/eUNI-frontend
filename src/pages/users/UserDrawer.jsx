import { Typography } from "antd";
import { DRAWER_TYPE, useDrawer } from "../../context/DrawerContext.jsx";
import { useTranslation } from "react-i18next";
import { FormNewPasswords } from "../../components/form/FormNewPasswords.jsx";
import hashPassword from "../../helpers/hashPassword.js";
import { createUser, updateUser } from "../../api/admin.js";
import DataDrawer from "../../components/DataDrawer.jsx";
import USER_ROLE from "../../enums/userRoles.js";
import { FormInput } from "../../components/form/FormInput.jsx";
import { FormEmail } from "../../components/form/FormEmail.jsx";
import { FormSelect } from "../../components/form/FormSelect.jsx";

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

    const handleOnSave = async function (form) {
        if (type === DRAWER_TYPE.edit)
            await updateUser(data.key, prepareEditUserPayload(form));
        else if (type === DRAWER_TYPE.create) {
            await createUser(prepareCreateUserPayload(form));
        } else {
            console.error("unknown drawer type");
        }
    };

    return (
        <>
            <DataDrawer
                width={600}
                title={{ create: t("create-user"), edit: t("edit-user") }}
                onSave={handleOnSave}
            >
                <Title level={3}>{t("basic-info")}</Title>
                <FormInput
                    name="firstName"
                    label={t("first-name")}
                    placeholder={t("enter-first-name")}
                />
                <FormInput
                    name="lastName"
                    label={t("last-name")}
                    placeholder={t("enter-last-name")}
                />
                <FormInput
                    name="lastName"
                    label={t("last-name")}
                    placeholder={t("enter-last-name")}
                />
                <FormEmail
                    name="email"
                    label={t("email")}
                    placeholder={t("enter-email")}
                />
                <FormSelect
                    name="roleId"
                    label={t("role")}
                    options={[
                        { value: USER_ROLE.Admin, label: "Admin" },
                        {
                            value: USER_ROLE.Student,
                            label: "Student"
                        }
                    ]}
                />
                <FormSelect
                    name="representativeFieldsOfStudyLogIds"
                    label={t("representative-fields-of-study")}
                    mode="multiple"
                    options={fieldsOfStudyInfoOptions}
                />
                <Title level={3}>{t("password")}</Title>
                <FormNewPasswords required={type === DRAWER_TYPE.create} />
            </DataDrawer>
        </>
    );
}

export default UserDrawer;
