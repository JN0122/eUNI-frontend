import AppLayout from "../../components/layout/AppLayout.jsx";
import { Alert, Button, Flex, Form, theme } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import hashPassword from "../../helpers/hashPassword.js";
import { FormEmail } from "../../components/form/FormEmail.jsx";
import FormPassword from "../../components/form/FormPassword.jsx";
import { useApiWithLoading } from "../../hooks/useApiWithLoading.jsx";

function Login() {
    const {
        token: { colorBgContainer, borderRadiusLG }
    } = theme.useToken();
    const { login } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [errorMessage, setErrorMessage] = useState(null);

    const [loginRequest, submitLoading] = useApiWithLoading(
        login,
        () => navigate("/"),
        () => setErrorMessage(t("error-login"))
    );

    async function onFinish(values) {
        await loginRequest({
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
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <FormEmail
                        name="email"
                        isRequired={true}
                        prefix={<UserOutlined />}
                        autoComplete="username"
                        placeholder={t("email")}
                    />
                    <FormPassword
                        name="password"
                        isRequired={true}
                        prefix={<LockOutlined />}
                        placeholder={t("password")}
                    />
                    <Form.Item>
                        <Flex justify="space-between" align="center">
                            <a href="">{t("forgot-password")}</a>
                        </Flex>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            block
                            type="primary"
                            htmlType="submit"
                            loading={submitLoading}
                        >
                            {t("login")}
                        </Button>
                    </Form.Item>
                </Form>
                <Button
                    block
                    color="primary"
                    variant="outlined"
                    onClick={() => navigate("/register")}
                >
                    {t("register-account")}
                </Button>
            </div>
        </AppLayout>
    );
}

export default Login;