import AppLayout from "../../components/layout/AppLayout.jsx";
import { Alert, Button, Form, theme } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import hashPassword from "../../helpers/hashPassword.js";
import { FormEmail } from "../../components/form/FormEmail.jsx";
import { useApiWithLoading } from "../../hooks/useApiWithLoading.jsx";
import { FormInput } from "../../components/form/FormInput.jsx";
import { FormNewPasswords } from "../../components/form/FormNewPasswords.jsx";
import { goBack } from "../../helpers/goBack.js";

export default function Register() {
    const {
        token: { colorBgContainer, borderRadiusLG }
    } = theme.useToken();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [errorMessage, setErrorMessage] = useState(null);

    const [registerRequest, submitLoading] = useApiWithLoading(
        async () => {
            return Promise.reject();
        },
        () => navigate("/"),
        () => setErrorMessage(t("error-login"))
    );

    async function onFinish(values) {
        await registerRequest({
            email: values.email,
            password: hashPassword(values.password)
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
                    <FormInput
                        name={"firstName"}
                        placeholder={t("enter-first-name")}
                        label={t("first-name")}
                        isRequired={true}
                    />
                    <FormInput
                        name={"lastName"}
                        placeholder={t("enter-last-name")}
                        label={t("last-name")}
                        isRequired={true}
                    />
                    <FormEmail
                        name="email"
                        label={t("email")}
                        autoComplete="username"
                        isRequired={true}
                        placeholder={t("enter-email")}
                    />
                    <FormNewPasswords />
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
