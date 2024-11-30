import { Button, Divider, Form, Input, notification, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useContentBlock } from "../../context/ContentBlockContext.jsx";
import { useEffect, useState } from "react";
import { changePassword } from "../../api/user.js";
import hashPassword from "../../helpers/hashPassword.js";
import getNotificationConfig from "../../helpers/getNotificationConfig.js";
import { FormPassword } from "../../components/form/FormPassword.jsx";

const { Title } = Typography;

function ProfilePassword() {
    const { t } = useTranslation();
    const { addBreadcrumb, setBreadcrumbsToDefault } = useContentBlock();
    const [form] = Form.useForm();

    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        addBreadcrumb(t("change-password"));
        return () => setBreadcrumbsToDefault();
    }, [addBreadcrumb, setBreadcrumbsToDefault, t]);

    async function onSubmit(values) {
        setSubmitLoading(true);
        try {
            await changePassword({
                oldPassword: hashPassword(values.oldPassword),
                newPassword: hashPassword(values.newPassword)
            });
            form.resetFields();
            notification.success(getNotificationConfig(t("password-success")));
        } catch {
            notification.error(getNotificationConfig(t("error-unexpected")));
        }
        setSubmitLoading(false);
    }

    return (
        <>
            <Title level={3}>{t("change-password")}</Title>
            <Form
                layout={"vertical"}
                onFinish={onSubmit}
                form={form}
                style={{
                    maxWidth: 600
                }}
            >
                <Form.Item
                    label={t("old-password")}
                    name="oldPassword"
                    rules={[
                        {
                            required: true,
                            message: t("error-password-is-required")
                        }
                    ]}
                >
                    <Input.Password
                        autoComplete="current-password"
                        placeholder={t("old-password")}
                    />
                </Form.Item>
                <Divider type="horizontal" />
                <FormPassword />
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={submitLoading}
                    >
                        {t("save")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default ProfilePassword;
