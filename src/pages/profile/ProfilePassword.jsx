import { Button, Divider, Form, Input, notification, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useSubPage } from "../../context/SubPageContext.jsx";
import { useEffect, useState } from "react";
import { changePassword } from "../../api/user.js";
import { hashPassword } from "../../helpers/passwordHasher.js";

const { Title } = Typography;

function ProfilePassword() {
    const { t } = useTranslation();
    const { setBreadcrumbs } = useSubPage();
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        setBreadcrumbs([{ title: t("change-password") }]);
        return () => setBreadcrumbs([]);
    }, [setBreadcrumbs, t]);

    async function onSubmit(values) {
        setSubmitLoading(true);
        const config = {
            message: t("password-success"),
            placement: "bottomRight",
        };
        try {
            await changePassword({
                oldPassword: hashPassword(values.oldPassword),
                newPassword: hashPassword(values.newPassword),
            });
            notification.success(config);
        } catch {
            config.message = t("error-unexpected");
            notification.error(config);
        }
        setSubmitLoading(false);
    }

    return (
        <>
            <Title level={3}>{t("change-password")}</Title>
            <Form
                layout={"vertical"}
                onFinish={onSubmit}
                style={{
                    maxWidth: 600,
                }}
            >
                <Form.Item
                    label={t("old-password")}
                    name="oldPassword"
                    rules={[
                        {
                            required: true,
                            message: t("error-password-is-required"),
                        },
                    ]}
                >
                    <Input.Password
                        suggested="current-password"
                        placeholder={t("old-password")}
                    />
                </Form.Item>
                <Divider type="horizontal" />
                <Form.Item
                    label={t("new-password")}
                    name="newPassword"
                    rules={[
                        {
                            pattern:
                                "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$",
                            required: true,
                            message: t("error-new-password"),
                        },
                    ]}
                >
                    <Input.Password placeholder={t("new-password")} />
                </Form.Item>
                <Form.Item
                    label={t("repeat-new-password")}
                    name="repeatNewPassword"
                    dependencies={["new-password"]}
                    rules={[
                        {
                            pattern:
                                "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$",
                            required: true,
                            message: t("error-new-password"),
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (
                                    !value ||
                                    getFieldValue("newPassword") === value
                                ) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error(t("error-password-not-match")),
                                );
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder={t("repeat-new-password")} />
                </Form.Item>
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
