import AppLayout from "../components/layout/AppLayout.jsx";
import { Button, Checkbox, Flex, Form, Input, theme } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

function Login() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        if (user !== null) {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    async function onFinish(values) {
        const response = await login({
            email: values.email,
            password: values.password,
        });
        if (response?.status === 200) {
            navigate("/dashboard");
        }
    }

    return (
        <AppLayout centerChildren={true} showHeaderLogo={true}>
            <Form
                name="login"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                style={{
                    width: "30rem",
                    padding: "3em",
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                <Form.Item
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: t("error-input-email"),
                        },
                    ]}
                >
                    <Input prefix={<UserOutlined />} placeholder={t("email")} />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: t("error-input-password"),
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
                    <Button block type="primary" htmlType="submit">
                        {t("login")}
                    </Button>
                </Form.Item>
            </Form>
        </AppLayout>
    );
}

export default Login;
