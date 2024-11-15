import { Form, Input, Typography } from "antd";
import { useDrawer } from "../../context/DrawerContext.jsx";
import { useTranslation } from "react-i18next";
import { PasswordInputs } from "../../components/PasswordInputs.jsx";
import hashPassword from "../../helpers/hashPassword.js";
import { updateUser } from "../../api/users.js";
import DataDrawer from "../../components/DataDrawer.jsx";

const { Title } = Typography;

function preparePayload(form) {
    return {
        firstName: form.getFieldValue("firstName"),
        lastName: form.getFieldValue("lastName"),
        email: form.getFieldValue("email"),
        newPassword: form.getFieldValue("newPassword")
            ? hashPassword(form.getFieldValue("newPassword"))
            : null
    };
}

function UserDrawer() {
    const { data } = useDrawer();
    const { t } = useTranslation();

    return (
        <>
            <DataDrawer
                title={t("edit-user")}
                onSave={(form) => updateUser(data.key, preparePayload(form))}
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
                <Title level={3}>{t("password")}</Title>
                <PasswordInputs required={false} />
            </DataDrawer>
        </>
    );
}

export default UserDrawer;
