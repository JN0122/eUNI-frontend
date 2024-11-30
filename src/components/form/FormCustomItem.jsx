import { Form } from "antd";
import { useTranslation } from "react-i18next";

export function FormCustomItem({
    name,
    label,
    isRequired = true,
    children,
    ...rest
}) {
    const { t } = useTranslation();
    let rules = [];

    if (isRequired)
        rules = [
            {
                required: isRequired,
                message: t("error-this-field-is-required")
            }
        ];
    return (
        <Form.Item name={name} label={label} rules={rules} {...rest}>
            {children}
        </Form.Item>
    );
}
