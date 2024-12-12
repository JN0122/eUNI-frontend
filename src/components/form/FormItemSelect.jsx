import { FormCustomItem } from "./FormCustomItem.jsx";
import SelectSearchByLabel from "./SelectSearchByLabel.jsx";

export function FormItemSelect({ label, name, isRequired, ...rest }) {
    return (
        <FormCustomItem label={label} name={name} isRequired={isRequired}>
            <SelectSearchByLabel popupMatchSelectWidth={false} {...rest} />
        </FormCustomItem>
    );
}
