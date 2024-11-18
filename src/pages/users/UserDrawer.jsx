import { Form, Input, Select, Typography } from "antd";
import { DRAWER_TYPE, useDrawer } from "../../context/DrawerContext.jsx";
import { useTranslation } from "react-i18next";
import { PasswordInputs } from "../../components/PasswordInputs.jsx";
import hashPassword from "../../helpers/hashPassword.js";
import { createUser, updateUser } from "../../api/admin.js";
import DataDrawer from "../../components/DataDrawer.jsx";
import USER_ROLE from "../../enums/userRoles.js";

const { Title } = Typography;

function prepareCreateUserPayload(form) {
    return {
        firstName: form.getFieldValue("firstName"),
        lastName: form.getFieldValue("lastName"),
        email: form.getFieldValue("email"),
        roleId: form.getFieldValue("roleId"),
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

function UserDrawer() {
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
                title={
                    type === DRAWER_TYPE.edit
                        ? t("edit-user")
                        : t("create-user")
                }
                onSave={handleOnSave}
            >
                <Title level={3}>{t("basic-info")}</Title>
                <Form.Item
                    name="firstName"
                    label={t("first-name")}
                    rules={[
                        {
                            required: true,
                            message: t("error-this-field-is-required")
                        }
                    ]}
                >
                    <Input placeholder={t("enter-first-name")} />
                </Form.Item>

                <Form.Item
                    name="lastName"
                    label={t("last-name")}
                    rules={[
                        {
                            required: true,
                            message: t("error-this-field-is-required")
                        }
                    ]}
                >
                    <Input placeholder={t("enter-last-name")} />
                </Form.Item>

                <Form.Item
                    name="email"
                    label={t("email")}
                    rules={[
                        {
                            type: "email",
                            required: true,
                            message: t("error-this-field-is-required")
                        }
                    ]}
                >
                    <Input placeholder={t("enter-email")} />
                </Form.Item>
                <Form.Item
                    label={t("role")}
                    name="roleId"
                    rules={[
                        {
                            required: true,
                            message: t("error-this-field-is-required")
                        }
                    ]}
                >
                    <Select
                        options={[
                            { value: USER_ROLE.Admin, label: "Admin" },
                            {
                                value: USER_ROLE.Student,
                                label: "Student"
                            }
                        ]}
                    />
                </Form.Item>
                <Title level={3}>{t("password")}</Title>
                <PasswordInputs required={type === DRAWER_TYPE.create} />
            </DataDrawer>
        </>
    );
}

export default UserDrawer;
