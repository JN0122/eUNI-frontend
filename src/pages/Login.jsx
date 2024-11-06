import AppLayout from "../components/AppLayout.jsx";
import { Alert, Button, Checkbox, Flex, Form, Input, theme } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import hashPassword from "../helpers/hashPassword.js";
import getErrorTranslationCode from "../helpers/getErrorTranslationCode.js";

function Login() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const { login, isAuthTokenActive, restoreSession } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [errorMessage, setErrorMessage] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        if (!isAuthTokenActive) {
            restoreSession()
                .then(() => {
                    navigate("/");
                })
                .catch(() => {
                    console.warn("Could not restore session");
                });
        } else {
            navigate("/");
        }
    }, [isAuthTokenActive, restoreSession, navigate]);

    async function onFinish(values) {
        setSubmitLoading(true);
        const response = await login({
            email: values.email,
            password: hashPassword(values.password),
        });
        setSubmitLoading(false);
        if (response.status === 200) {
            navigate("/");
        } else {
            setErrorMessage(
                t(getErrorTranslationCode("error-login", response.status)),
            );
        }
    }

    return (
        <AppLayout centerChildren={true} showHeaderLogo={true}>
            <div
                style={{
                    width: "30rem",
                    padding: "3em",
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
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
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                type: "email",
                                required: true,
                                message: t("error-correct-email-is-required"),
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder={t("email")}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: t("error-password-is-required"),
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            type="password"
                            placeholder={t("password")}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Flex justify="space-between" align="center">
                            <Form.Item
                                name="remember"
                                valuePropName="checked"
                                noStyle
                            >
                                <Checkbox>{t("remember-me")}</Checkbox>
                            </Form.Item>
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
            </div>
        </AppLayout>
    );
}

export default Login;
