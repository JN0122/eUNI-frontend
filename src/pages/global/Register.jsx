import AppLayout from "../../components/layout/AppLayout.jsx";
import { Alert, Button, Checkbox, Form, theme } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import hashPassword from "../../helpers/hashPassword.js";
import { FormItemEmail } from "../../components/form/FormItemEmail.jsx";
import { useApiWithLoading } from "../../hooks/useApiWithLoading.js";
import { FormItemInput } from "../../components/form/FormItemInput.jsx";
import { FormItemNewPasswords } from "../../components/form/FormItemNewPasswords.jsx";
import { goBack } from "../../helpers/goBack.js";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useNotification } from "../../hooks/useNotification.jsx";
import { NOTIFICATION_TYPES } from "../../enums/NotificationTypes.js";
import { FormCustomItem } from "../../components/form/FormCustomItem.jsx";

export default function Register() {
    const {
        token: { colorBgContainer, borderRadiusLG }
    } = theme.useToken();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { register } = useAuth();
    const { displayMessage, handleApiError } = useNotification();
    const [errorMessage, setErrorMessage] = useState(null);

    const [registerRequest, submitLoading] = useApiWithLoading(
        register,
        () => {
            navigate("/");
            displayMessage(t("register-success"), NOTIFICATION_TYPES.success);
        },
        (error) => {
            if (error.status === 400)
                setErrorMessage(t("account-already-exists"));
            else handleApiError(error);
        }
    );

    async function onFinish(values) {
        await registerRequest({
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            password: hashPassword(values.newPassword),
            repeatPassword: hashPassword(values.repeatNewPassword),
            agreedToTerms: values.agreedToTerms
        });
    }

    return (
        <AppLayout centerChildren={true} showHeaderLogo={true}>
            <div
                style={{
                    width: "30rem",
                    padding: "3em",
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG
                }}
            >
                {errorMessage && (
                    <Alert
                        message={`${t("error")}`}
                        description={errorMessage}
                        type="error"
                        showIcon
                        style={{ marginBottom: "1rem" }}
                    />
                )}
                <Form name="register" onFinish={onFinish} layout={"vertical"}>
                    <FormItemInput
                        name={"firstName"}
                        placeholder={t("enter-first-name")}
                        label={t("first-name")}
                        isRequired={true}
                    />
                    <FormItemInput
                        name={"lastName"}
                        placeholder={t("enter-last-name")}
                        label={t("last-name")}
                        isRequired={true}
                    />
                    <FormItemEmail
                        name="email"
                        label={t("email")}
                        autoComplete="username"
                        isRequired={true}
                        placeholder={t("enter-email")}
                    />
                    <FormItemNewPasswords />
                    <FormCustomItem
                        name="agreedToTerms"
                        valuePropName="checked"
                    >
                        <Checkbox required={true}>
                            {t("agree-to-data-processing")}
                        </Checkbox>
                    </FormCustomItem>
                    <Form.Item>
                        <Button
                            block
                            type="primary"
                            htmlType="submit"
                            loading={submitLoading}
                        >
                            {t("register-account")}
                        </Button>
                    </Form.Item>
                    <Button
                        block
                        icon={<ArrowLeftOutlined />}
                        onClick={goBack}
                        type="link"
                    >
                        {t("go-back")}
                    </Button>
                </Form>
            </div>
        </AppLayout>
    );
}
