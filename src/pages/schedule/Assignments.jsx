import { useTranslation } from "react-i18next";
import { useEffect, useMemo } from "react";
import { Button, Flex, Spin, Typography } from "antd";
import TableWithActions from "../../components/TableWithActions.jsx";
import { useDrawer } from "../../context/DrawerContext.jsx";
import AssignmentsDrawer from "./AssignmentsDrawer.jsx";
import { deleteAssignment, getAssignments } from "../../api/assignments.js";
import { useContentBlock } from "../../context/ContentBlockContext.jsx";
import { useUser } from "../../context/UserContext.jsx";
import dayjs from "dayjs";

const { Text } = Typography;

function Assignments() {
    const { openCreateDrawer } = useDrawer();
    const { t } = useTranslation();
    const { addBreadcrumb, setBreadcrumbsToDefault } = useContentBlock();
    const { currentFieldOfInfo } = useUser();

    useEffect(() => {
        addBreadcrumb(t("assignments"));
        return () => setBreadcrumbsToDefault();
    }, [addBreadcrumb, setBreadcrumbsToDefault, t]);

    const modalConfirmContent = (record) => (
        <>
            {t("assignment-name")}: <Text strong>{record.assignmentName}</Text>
            <br />
            {t("class-name")}: <Text strong>{record.className}</Text> <br />
            {t("deadline-date")}: <Text strong>{record.deadlineDate}</Text>
            <br />
        </>
    );

    const parseData = function (value) {
        return { ...value, deadlineDate: dayjs(value.deadlineDate) };
    };

    const handleRemove = async function (record) {
        await deleteAssignment(record.key);
    };

    const columns = useMemo(
        () => [
            {
                title: t("assignment-name"),
                dataIndex: "assignmentName"
            },
            {
                title: t("deadline-date"),
                dataIndex: "deadlineDate"
            },
            {
                title: t("class-name"),
                dataIndex: "className",
                withSearch: true,
                searchInputText: t("class-name"),
                withSort: true
            }
        ],
        [t]
    );
    if (!currentFieldOfInfo) return <Spin></Spin>;

    function handleFetchData() {
        return getAssignments(currentFieldOfInfo?.fieldOfStudyLogId);
    }

    return (
        <>
            <Flex
                gap="small"
                style={{ paddingBottom: "1rem", flexDirection: "row-reverse" }}
            >
                <Button type={"primary"} onClick={() => openCreateDrawer()}>
                    {t("create-assignment")}
                </Button>
            </Flex>
            <AssignmentsDrawer />
            <TableWithActions
                columns={columns}
                fetchData={handleFetchData}
                modalConfirmContent={modalConfirmContent}
                customDataParse={parseData}
                onModalConfirm={handleRemove}
                notificationSuccessText={t("success-remove-assignment")}
            />
        </>
    );
}

export default Assignments;
