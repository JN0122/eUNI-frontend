import { Input } from "antd";
import { FormCustomItem } from "./FormCustomItem.jsx";
import { useTranslation } from "react-i18next";

export default function FormItemPassword({
    name,
    isRequired,
    placeholder,
    label,
    ...rest
}) {
    const { t } = useTranslation();
    return (
        <FormCustomItem
            name={name}
            customErrorMessage={t("error-password-is-required")}
            label={label}
            isRequired={isRequired}
        >
            <Input.Password
                autoComplete="current-password"
                type="password"
                placeholder={placeholder}
                {...rest}
            />
        </FormCustomItem>
    );
}
