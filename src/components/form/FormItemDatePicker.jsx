import { DatePicker } from "antd";
import { FormCustomItem } from "./FormCustomItem.jsx";

export default function FormItemDatePicker({
    name,
    label,
    isRequired,
    ...rest
}) {
    return (
        <FormCustomItem name={name} label={label} isRequired={isRequired}>
            <DatePicker needConfirm {...rest} />
        </FormCustomItem>
    );
}
