import { Form } from "antd";
import { useTranslation } from "react-i18next";

export function FormCustomItem({
    name,
    label,
    isRequired = true,
    customRules = [{}],
    children,
    ...rest
}) {
    const { t } = useTranslation();
    let rules = customRules;

    if (isRequired)
        rules = [
            {
                required: isRequired,
                message: t("error-this-field-is-required"),
                ...rules[0]
            }
        ];
    return (
        <Form.Item name={name} label={label} rules={rules} {...rest}>
            {children}
        </Form.Item>
    );
}
