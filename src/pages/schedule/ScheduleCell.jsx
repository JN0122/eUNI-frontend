import { FileOutlined } from "@ant-design/icons";
import { Flex, Typography } from "antd";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

function ScheduleCell({ cellData }) {
    const { t } = useTranslation();
    if (cellData == null) return null;
    let cellContent = (
        <>
            <Text strong>{cellData.name}</Text>
            <Text>{cellData.room}</Text>
            {cellData.assignment && (
                <Flex gap={"0.5rem"} justify={"center"}>
                    <FileOutlined />
                    <Text>{cellData.assignment.name}</Text>
                </Flex>
            )}
        </>
    );

    if (cellData.type === -1) {
        cellContent = (
            <>
                <Text strong>{t("day-off")}</Text>
            </>
        );
    }

    return (
        <Flex
            vertical
            gap={"0.5rem"}
            style={{
                padding: "0.5em",
                margin: "auto",
                width: "10rem"
            }}
        >
            {cellContent}
        </Flex>
    );
}

export default ScheduleCell;
