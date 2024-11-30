import { FormCustomItem } from "./FormCustomItem.jsx";
import { Input } from "antd";
import { useTranslation } from "react-i18next";

export function FormEmail({ name, label, isRequired, placeholder, ...rest }) {
    const { t } = useTranslation();
    return (
        <FormCustomItem
            name={name}
            label={label}
            isRequired={isRequired}
            customRules={[
                {
                    type: "email",
                    message: t("error-enter-correct-email")
                }
            ]}
        >
            <Input placeholder={placeholder} {...rest} />
        </FormCustomItem>
    );
}
