import { useTranslation } from "react-i18next";
import { useEffect, useMemo } from "react";
import { Button, Flex, Spin, Typography } from "antd";
import TableWithActions from "../../components/TableWithActions.jsx";
import { useDrawer } from "../../context/DrawerContext.jsx";
import AssignmentsDrawer from "./AssignmentsDrawer.jsx";
import { useContentBlock } from "../../context/ContentBlockContext.jsx";
import { useUser } from "../../context/UserContext.jsx";
import { deleteClasses, getClasses } from "../../api/classes.js";

const { Text } = Typography;

function Classes() {
    const { openCreateDrawer } = useDrawer();
    const { t } = useTranslation();
    const { addBreadcrumb, setBreadcrumbsToDefault } = useContentBlock();
    const { currentFieldOfInfo } = useUser();

    useEffect(() => {
        addBreadcrumb(t("classes"));
        return () => setBreadcrumbsToDefault();
    }, [addBreadcrumb, setBreadcrumbsToDefault, t]);

    const modalConfirmContent = (record) => (
        <>
            {t("class-name")}: <Text strong>{record.className}</Text>
            <br />
        </>
    );

    const handleRemove = async function (record) {
        await deleteClasses(record.key);
    };

    const columns = useMemo(
        () => [
            {
                title: t("class-name"),
                dataIndex: "className",
                withSort: true
            },
            {
                title: t("room"),
                dataIndex: "classRoom"
            },
            {
                title: t("group-name"),
                dataIndex: "groupName"
            },
            {
                title: t("class-repeatability"),
                dataIndex: "isOddWeek"
            },
            {
                title: t("week-day"),
                dataIndex: "weekDay"
            },
            {
                title: t("start-hour"),
                dataIndex: "startHour"
            },
            {
                title: t("end-hour"),
                dataIndex: "endHour"
            }
        ],
        [t]
    );
    if (!currentFieldOfInfo) return <Spin></Spin>;

    function handleFetchData() {
        return getClasses(currentFieldOfInfo?.fieldOfStudyLogId);
    }

    return (
        <>
            <Flex
                gap="small"
                style={{ paddingBottom: "1rem", flexDirection: "row-reverse" }}
            >
                <Button type={"primary"} onClick={() => openCreateDrawer()}>
                    {t("create-class")}
                </Button>
            </Flex>
            <AssignmentsDrawer />
            <TableWithActions
                columns={columns}
                fetchData={handleFetchData}
                modalConfirmContent={modalConfirmContent}
                onModalConfirm={handleRemove}
                notificationSuccessText={t("success-remove-class")}
            />
        </>
    );
}

export default Classes;
