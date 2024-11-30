import { Select, Typography } from "antd";
import { DRAWER_TYPE, useDrawer } from "../../context/DrawerContext.jsx";
import { useTranslation } from "react-i18next";
import { PasswordInputs } from "../../components/PasswordInputs.jsx";
import hashPassword from "../../helpers/hashPassword.js";
import { createUser, updateUser } from "../../api/admin.js";
import DataDrawer from "../../components/DataDrawer.jsx";
import USER_ROLE from "../../enums/userRoles.js";
import { FormInput } from "../../components/form/FormInput.jsx";
import { FormEmail } from "../../components/form/FormEmail.jsx";
import { FormCustomItem } from "../../components/form/FormCustomItem.jsx";

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
                title={
                    type === DRAWER_TYPE.edit
                        ? t("edit-user")
                        : t("create-user")
                }
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
                <FormCustomItem name="roleId" label={t("role")}>
                    <Select
                        options={[
                            { value: USER_ROLE.Admin, label: "Admin" },
                            {
                                value: USER_ROLE.Student,
                                label: "Student"
                            }
                        ]}
                    />
                </FormCustomItem>
                <FormCustomItem
                    label={t("representative-fields-of-study")}
                    name="representativeFieldsOfStudyLogIds"
                >
                    <Select
                        mode="multiple"
                        placeholder={t("representative-fields-of-study")}
                        filterOption={(input, option) =>
                            (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                        }
                        options={fieldsOfStudyInfoOptions}
                    />
                </FormCustomItem>
                <Title level={3}>{t("password")}</Title>
                <PasswordInputs required={type === DRAWER_TYPE.create} />
            </DataDrawer>
        </>
    );
}

export default UserDrawer;
