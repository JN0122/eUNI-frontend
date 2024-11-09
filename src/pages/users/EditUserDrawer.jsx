import {
    Button,
    Drawer,
    Form,
    Input,
    notification,
    Space,
    Typography,
} from "antd";
import { useDrawer } from "../../context/DrawerContext.jsx";
import { useTranslation } from "react-i18next";
import { PasswordInputs } from "../../components/PasswordInputs.jsx";
import { useEffect } from "react";
import hashPassword from "../../helpers/hashPassword.js";
import getNotificationConfig from "../../helpers/getNotificationConfig.js";
import { updateUser } from "../../api/users.js";

const { Title } = Typography;

function isFormValid(form) {
    const errors = form.getFieldsError().map((field) => !!field.errors.length);
    for (const error of errors) {
        if (error) return false;
    }
    return true;
}

function preparePayload(form) {
    console.log(form.getFieldValue("newPassword"));
    return {
        firstName: form.getFieldValue("firstName"),
        lastName: form.getFieldValue("lastName"),
        email: form.getFieldValue("email"),
        newPassword: form.getFieldValue("newPassword")
            ? hashPassword(form.getFieldValue("newPassword"))
            : null,
    };
}

function getFieldsObject(data) {
    return [
        { name: "firstName", value: data.firstName },
        { name: "lastName", value: data.lastName },
        { name: "email", value: data.email },
        { name: "newPassword", value: "" },
        { name: "repeatNewPassword", value: "" },
    ];
}

function EditUserDrawer() {
    const { isOpen, closeDrawer, data, setData } = useDrawer();
    const { t } = useTranslation();
    const [form] = Form.useForm();

    useEffect(() => {
        if (isOpen) {
            form.setFields(getFieldsObject(data));
        }
    }, [isOpen, form, data]);

    function handleSubmit(form) {
        if (!isFormValid(form)) return;

        updateUser(data.key, preparePayload(form))
            .then(() => {
                setData(null);
                closeDrawer();
                notification.success(
                    getNotificationConfig(t("update-success")),
                );
            })
            .catch(() => {
                notification.error(
                    getNotificationConfig(t("error-unexpected")),
                );
            });
    }

    return (
        <>
            <Drawer
                title={t("edit-user")}
                width={360}
                onClose={closeDrawer}
                open={isOpen}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
                extra={
                    <Space>
                        <Button onClick={closeDrawer}>{t("cancel")}</Button>
                        <Button
                            onClick={() => handleSubmit(form, data.key)}
                            type="primary"
                        >
                            {t("save")}
                        </Button>
                    </Space>
                }
            >
                <Title level={3}>{t("basic-info")}</Title>

                <Form layout="vertical" form={form} autoComplete="off">
                    <Form.Item
                        name="firstName"
                        label={t("first-name")}
                        rules={[
                            {
                                required: true,
                                message: t("error-this-field-is-required"),
                            },
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
                                message: t("error-this-field-is-required"),
                            },
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
                                message: t("error-this-field-is-required"),
                            },
                        ]}
                    >
                        <Input placeholder={t("enter-email")} />
                    </Form.Item>
                    <Title level={3}>{t("password")}</Title>
                    <PasswordInputs required={false} />
                </Form>
            </Drawer>
        </>
    );
}

export default EditUserDrawer;
