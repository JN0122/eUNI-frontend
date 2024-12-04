import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Flex, Typography } from "antd";
import TableWithActions from "../../components/content/TableWithActions.jsx";
import { useDrawer } from "../../hooks/useDrawer.jsx";
import { useContentBlock } from "../../hooks/useContentBlock.jsx";
import { useUser } from "../../hooks/useUser.jsx";
import { deleteClass, getClasses } from "../../api/representative.js";
import ClassesDrawer from "./ClassesDrawer.jsx";
import dayjs from "dayjs";
import { useNotification } from "../../hooks/useNotification.jsx";
import { useApiWithLoading } from "../../hooks/useApiWithLoading.js";
import { useApi } from "../../hooks/useApi.js";

const { Text } = Typography;

function Classes() {
    const { openCreateDrawer } = useDrawer();
    const { t } = useTranslation();
    const { addBreadcrumb, setBreadcrumbsToDefault } = useContentBlock();
    const { currentFieldOfStudyInfo } = useUser();
    const { handleApiError, displayMessage } = useNotification();
    const [rows, setRows] = useState([]);
    const [selectedRow, setSelectedRow] = useState({});

    useEffect(() => {
        addBreadcrumb(t("classes"));
        return () => setBreadcrumbsToDefault();
    }, [addBreadcrumb, setBreadcrumbsToDefault, t]);

    const renderModalContent = useCallback(
        (record) => (
            <>
                {t("class-name")}: <Text strong>{record.className}</Text>
                <br />
            </>
        ),
        [t]
    );

    const [getClassesRequest, isLoading] = useApiWithLoading(
        getClasses,
        (data) =>
            setRows(
                data.map((value) => {
                    value.key = value.id;
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
                })
            ),
        handleApiError
    );

    useEffect(() => {
        if (!currentFieldOfStudyInfo?.fieldOfStudyLogId) return;
        getClassesRequest(currentFieldOfStudyInfo?.fieldOfStudyLogId);
    }, [currentFieldOfStudyInfo?.fieldOfStudyLogId]);

    const deleteClassRequest = useApi(
        deleteClass,
        () => {
            displayMessage(t("success-removed"));
            getClassesRequest(currentFieldOfStudyInfo?.fieldOfStudyLogId);
        },
        handleApiError
    );

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
            <ClassesDrawer selectedRow={selectedRow} />
            <TableWithActions
                columns={columns}
                rows={rows}
                loading={isLoading}
                modalRenderConfirmContent={renderModalContent}
                onDelete={(row) => deleteClassRequest(row.id)}
                onEdit={(row) => setSelectedRow(row)}
            />
        </>
    );
}

export default Classes;
