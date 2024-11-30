import { Select } from "antd";
import { FormCustomItem } from "./FormCustomItem.jsx";

export function FormSelect({ label, name, isRequired, ...rest }) {
    return (
        <FormCustomItem label={label} name={name} isRequired={isRequired}>
            <Select
                filterOption={(input, option) =>
                    (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                }
                {...rest}
            />
        </FormCustomItem>
    );
}
