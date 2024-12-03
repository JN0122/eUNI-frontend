import { useTranslation } from "react-i18next";
import { useEffect, useMemo } from "react";
import { Button, Flex, Spin, Typography } from "antd";
import TableWithActions from "../../components/content/TableWithActions.jsx";
import { useDrawer } from "../../hooks/useDrawer.jsx";
import { useContentBlock } from "../../hooks/useContentBlock.jsx";
import { useUser } from "../../hooks/useUser.jsx";
import { deleteClass, getClasses } from "../../api/representative.js";
import ClassesDrawer from "./ClassesDrawer.jsx";
import dayjs from "dayjs";

const { Text } = Typography;

function Classes() {
    const { openCreateDrawer } = useDrawer();
    const { t } = useTranslation();
    const { addBreadcrumb, setBreadcrumbsToDefault } = useContentBlock();
    const { currentFieldOfStudyInfo } = useUser();

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
        await deleteClass(record.key);
    };

    const columns = useMemo(
        () => [
            {
                title: t("class-name"),
                dataIndex: "className",
                withSearch: true
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
                title: t("class-dates"),
                dataIndex: "classDates",
                withSearch: true,
                width: 200
            },
            {
                title: t("start-hour"),
                dataIndex: "startHourTime"
            },
            {
                title: t("end-hour"),
                dataIndex: "endHourTime"
            }
        ],
        [t]
    );
    if (!currentFieldOfStudyInfo) return <Spin></Spin>;

    async function handleFetchData() {
        const response = await getClasses(
            currentFieldOfStudyInfo?.fieldOfStudyLogId
        );
        response.data = response.data.map((value) => {
            value.dates = value.dates
                .map((date) => dayjs(date))
                .sort((a, b) => a - b);
            value.classDates = value.dates
                .map((date) => date.format("YYYY-MM-DD"))
                .join(", ");
            value.startHourTime = value.startHour.startTime;
            value.startHourId = value.startHour.hourId;
            value.endHourTime = value.endHour.endTime;
            value.endHourId = value.endHour.hourId;
            return value;
        });
        return response;
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
            <ClassesDrawer />
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
