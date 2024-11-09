import { Button, Drawer, Form, Input, Space, Typography } from "antd";
import { useDrawer } from "../../context/DrawerContext.jsx";
import { useTranslation } from "react-i18next";
import { PasswordInputs } from "../../components/PasswordInputs.jsx";
import { useEffect } from "react";

const { Title } = Typography;

function getTouchedFields(form) {
    const fields = Object.keys(form.getFieldsValue());
    return fields.filter((field) => {
        const isTouched = form.isFieldTouched(field);
        if (isTouched && !form.getFieldValue(field)) {
            return false;
        }
        return isTouched;
    });
}

function isFormValid(form) {
    const errors = form.getFieldsError().map((field) => !!field.errors.length);
    for (const error of errors) {
        if (error) return false;
    }
    return true;
}

function handleSubmit(form) {
    if (!isFormValid(form)) return;

    const touchedFields = getTouchedFields(form);
    if (touchedFields.length === 0) return;

    console.log(touchedFields);
}

function getFieldsObject(data) {
    return [
        { name: "firstName", value: data.firstName },
        { name: "lastName", value: data.lastName },
        { name: "email", value: data.email },
        { name: "newPassword", value: "" },
    ];
}

function EditUserDrawer() {
    const { isOpen, closeDrawer, data } = useDrawer();
    const { t } = useTranslation();
    const [form] = Form.useForm();

    useEffect(() => {
        if (isOpen) {
            form.setFields(getFieldsObject(data));
        }
    }, [isOpen, form, data]);

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
                            onClick={() => handleSubmit(form)}
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
