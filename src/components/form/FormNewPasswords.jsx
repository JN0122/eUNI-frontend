import { Form, Input } from "antd";
import { useTranslation } from "react-i18next";
import { FormCustomItem } from "./FormCustomItem.jsx";

export function FormNewPasswords({ required = true, ...rest }) {
    const { t } = useTranslation();

    return (
        <>
            <FormCustomItem
                label={t("new-password")}
                name="newPassword"
                rules={[
                    {
                        pattern: import.meta.env.VITE_PASSWORD_PATTERN,
                        required: required,
                        message: t("error-new-password")
                    }
                ]}
            >
                <Input.Password
                    autoComplete="new-password"
                    placeholder={t("new-password")}
                    {...rest}
                />
            </FormCustomItem>
            <Form.Item
                label={t("repeat-new-password")}
                name="repeatNewPassword"
                dependencies={["newPassword"]}
                rules={[
                    {
                        pattern: import.meta.env.VITE_PASSWORD_PATTERN,
                        required: required,
                        message: t("error-new-password")
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (getFieldValue("newPassword") === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(
                                new Error(t("error-password-not-match"))
                            );
                        }
                    })
                ]}
            >
                <Input.Password
                    placeholder={t("repeat-new-password")}
                    autoComplete="new-password"
                    {...rest}
                />
            </Form.Item>
        </>
    );
}
