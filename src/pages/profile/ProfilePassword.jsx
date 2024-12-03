import { Button, Divider, Form, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useContentBlock } from "../../hooks/useContentBlock.jsx";
import { useEffect } from "react";
import { changePassword } from "../../api/user.js";
import hashPassword from "../../helpers/hashPassword.js";
import { FormNewPasswords } from "../../components/form/FormNewPasswords.jsx";
import { useApi } from "../../hooks/useApi.jsx";
import { useNotification } from "../../hooks/useNotification.jsx";
import FormPassword from "../../components/form/FormPassword.jsx";

const { Title } = Typography;

function ProfilePassword() {
    const { t } = useTranslation();
    const { displayNotification, handleApiError } = useNotification();
    const { addBreadcrumb, setBreadcrumbsToDefault } = useContentBlock();
    const [form] = Form.useForm();
    const [changePasswordRequest, isLoading] = useApi(
        changePassword,
        () => {
            displayNotification(t("password-success"));
            form.resetFields();
        },
        handleApiError
    );

    useEffect(() => {
        addBreadcrumb(t("change-password"));
        return () => setBreadcrumbsToDefault();
    }, [addBreadcrumb, setBreadcrumbsToDefault, t]);

    async function onSubmit(values) {
        await changePasswordRequest({
            oldPassword: hashPassword(values.oldPassword),
            newPassword: hashPassword(values.newPassword)
        });
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
                <FormPassword
                    name="oldPassword"
                    label={t("old-password")}
                    isRequired={true}
                    placeholder={t("old-password")}
                />
                <Divider type="horizontal" />
                <FormNewPasswords />
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                    >
                        {t("save")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default ProfilePassword;
