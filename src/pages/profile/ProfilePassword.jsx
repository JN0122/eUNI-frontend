import { Button, Divider, Form, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { changePassword } from "../../api/user.js";
import hashPassword from "../../helpers/hashPassword.js";
import { FormItemNewPasswords } from "../../components/form/FormItemNewPasswords.jsx";
import { useNotification } from "../../hooks/useNotification.jsx";
import FormItemPassword from "../../components/form/FormItemPassword.jsx";
import { useApiWithLoading } from "../../hooks/useApiWithLoading.js";
import ContentBlockBreadcrumb from "../../components/content/ContentBlockBreadcrumb.jsx";

const { Title } = Typography;

function ProfilePassword() {
    const { t } = useTranslation();
    const { displayNotification, handleApiError } = useNotification();
    const [form] = Form.useForm();
    const [changePasswordRequest, isLoading] = useApiWithLoading(
        changePassword,
        () => {
            displayNotification(t("password-success"));
            form.resetFields();
        },
        handleApiError
    );

    async function onSubmit(values) {
        await changePasswordRequest({
            oldPassword: hashPassword(values.oldPassword),
            newPassword: hashPassword(values.newPassword)
        });
    }

    return (
        <ContentBlockBreadcrumb currentPath={t("change-password")}>
            <Title level={3}>{t("change-password")}</Title>
            <Form
                layout={"vertical"}
                onFinish={onSubmit}
                form={form}
                style={{
                    maxWidth: 600
                }}
            >
                <FormItemPassword
                    name="oldPassword"
                    label={t("old-password")}
                    isRequired={true}
                    placeholder={t("old-password")}
                />
                <Divider type="horizontal" />
                <FormItemNewPasswords />
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
        </ContentBlockBreadcrumb>
    );
}

export default ProfilePassword;
