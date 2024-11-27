import { FileOutlined } from "@ant-design/icons";
import { Flex, Typography } from "antd";

const { Text } = Typography;

function ScheduleCell({ cellData }) {
    if (cellData == null) return null;
    return (
        <Flex
            vertical
            gap={"0.5rem"}
            style={{
                padding: "0.5em",
                margin: "auto"
            }}
        >
            <Text strong>{cellData.name}</Text>
            <Text>{cellData.room}</Text>
            {cellData.assignment && (
                <Flex gap={"0.5rem"} justify={"center"}>
                    <FileOutlined />
                    <Text>{cellData.assignment.name}</Text>
                </Flex>
            )}
        </Flex>
    );
}

export default ScheduleCell;
