import { useTranslation } from "react-i18next";
import { useEffect, useMemo } from "react";
import { Button, Flex, Spin, Typography } from "antd";
import TableWithActions from "../../components/TableWithActions.jsx";
import { useDrawer } from "../../context/DrawerContext.jsx";
import { useContentBlock } from "../../context/ContentBlockContext.jsx";
import { useUser } from "../../context/UserContext.jsx";
import { deleteClass, getClasses } from "../../api/representative.js";
import { DAYS } from "../../enums/weekDays.js";
import { isOddWeekMap } from "../../helpers/isOddWeekMap.js";
import ClassesDrawer from "./ClassesDrawer.jsx";

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
                title: t("class-repeatability"),
                dataIndex: "isOddWeekParsed",
                withSort: true
            },
            {
                title: t("week-day"),
                dataIndex: "weekDayParsed",
                withSort: true
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
    if (!currentFieldOfInfo) return <Spin></Spin>;

    async function handleFetchData() {
        const response = await getClasses(
            currentFieldOfInfo?.fieldOfStudyLogId
        );
        response.data = response.data.map((value) => {
            value.isOddWeekParsed = t(isOddWeekMap(value.isOddWeek));
            value.isOddWeek = `${value.isOddWeek}`;
            value.weekDayParsed = t(DAYS[value.weekDay]);
            value.startHourTime = value.startHour?.startTime;
            value.startHourId = value.startHour?.hourId;
            value.endHourTime = value.endHour?.endTime;
            value.endHourId = value.endHour?.hourId;
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
