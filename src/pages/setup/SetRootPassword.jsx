import AppLayout from "../../components/layout/AppLayout.jsx";
import { Button, Form, theme } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import hashPassword from "../../helpers/hashPassword.js";
import FormItemPassword from "../../components/form/FormItemPassword.jsx";
import { useApiWithLoading } from "../../hooks/useApiWithLoading.js";
import { useNotification } from "../../hooks/useNotification.jsx";
import { resetDb, setRootPassword } from "../../api/setup.js";
import { useApi } from "../../hooks/useApi.js";

function SetRootPassword() {
    const {
        token: { colorBgContainer, borderRadiusLG }
    } = theme.useToken();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const { displayNotification, handleApiError } = useNotification();

    const clearForm = useCallback(
        function () {
            form.resetFields();
        },
        [form]
    );

    const resetDbRequest = useApi(
        resetDb,
        () => {},
        (e) => {
            handleApiError(e);
        },
        false
    );

    const [setRootPasswordRequest, submitLoading] = useApiWithLoading(
        setRootPassword,
        () => {
            displayNotification(
                t("change-root-password-success", { email: "root@euni.com" })
            );
            navigate("/login");
        },
        (e) => {
            handleApiError(e);
            clearForm();
        },
        false
    );

    const onFinish = useCallback(
        async function (values) {
            await resetDbRequest();
            await setRootPasswordRequest({
                password: hashPassword(values.password)
            });
        },
        [setRootPasswordRequest]
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
                <Form name="seed_db" onFinish={onFinish} form={form}>
                    <FormItemPassword
                        name="password"
                        isRequired={true}
                        prefix={<LockOutlined />}
                        placeholder={t("password")}
                    />

                    <Form.Item>
                        <Button
                            block
                            type="primary"
                            htmlType="submit"
                            loading={submitLoading}
                        >
                            {t("set-password")}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </AppLayout>
    );
}

export default SetRootPassword;
