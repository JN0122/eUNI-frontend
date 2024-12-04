import { FormCustomItem } from "./FormCustomItem.jsx";
import { Input } from "antd";

export function FormItemInput({
    name,
    label,
    isRequired,
    placeholder,
    ...rest
}) {
    return (
        <FormCustomItem name={name} label={label} isRequired={isRequired}>
            <Input placeholder={placeholder} {...rest} />
        </FormCustomItem>
    );
}
