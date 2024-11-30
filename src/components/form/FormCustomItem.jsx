import { Form } from "antd";
import { useTranslation } from "react-i18next";

export function FormCustomItem({
    name,
    label,
    isRequired,
    customErrorMessage,
    type,
    children,
    ...rest
}) {
    const { t } = useTranslation();
    let rules = [{ type }];

    if (isRequired)
        rules = [
            {
                ...rules[0],
                required: isRequired,
                message: customErrorMessage || t("error-this-field-is-required")
            }
        ];
    return (
        <Form.Item name={name} label={label} rules={rules} {...rest}>
            {children}
        </Form.Item>
    );
}
