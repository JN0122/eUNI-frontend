import AppLayout from "../../components/layout/AppLayout.jsx";
import { Alert, Button, Flex, Form, theme } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import hashPassword from "../../helpers/hashPassword.js";
import { FormItemEmail } from "../../components/form/FormItemEmail.jsx";
import FormItemPassword from "../../components/form/FormItemPassword.jsx";
import { useApiWithLoading } from "../../hooks/useApiWithLoading.js";
import { useNotification } from "../../hooks/useNotification.jsx";

function Login() {
    const {
        token: { colorBgContainer, borderRadiusLG }
    } = theme.useToken();
    const { login } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [errorMessage, setErrorMessage] = useState(null);
    const [form] = Form.useForm();
    const { handleApiError } = useNotification();

    const clearForm = useCallback(
        function () {
            form.resetFields();
        },
        [form]
    );

    const [loginRequest, submitLoading] = useApiWithLoading(
        login,
        () => navigate("/"),
        (e) => {
            if (e.status === 401) setErrorMessage(t("error-login"));
            else handleApiError(e);
            clearForm();
        },
        false
    );

    const onFinish = useCallback(
        async function (values) {
            setErrorMessage(null);
            await loginRequest({
                email: values.email,
                password: hashPassword(values.password)
            });
        },
        [loginRequest]
    );

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
                <Form name="login" onFinish={onFinish} form={form}>
                    <FormItemEmail
                        name="email"
                        isRequired={true}
                        prefix={<UserOutlined />}
                        autoComplete="username"
                        placeholder={t("email")}
                    />
                    <FormItemPassword
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
