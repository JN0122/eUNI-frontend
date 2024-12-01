import { Select } from "antd";

export default function SelectSearchByLabel({ ...rest }) {
    return (
        <Select
            showSearch={true}
            filterOption={(input, option) =>
                (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
            }
            {...rest}
        />
    );
}
