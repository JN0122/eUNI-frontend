import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Flex, Typography } from "antd";
import TableWithActions from "../../components/content/TableWithActions.jsx";
import { useUser } from "../../hooks/useUser.jsx";
import {
    createClass,
    deleteClass,
    getClasses,
    updateClass
} from "../../api/representative.js";
import dayjs from "dayjs";
import { useNotification } from "../../hooks/useNotification.jsx";
import { useApiWithLoading } from "../../hooks/useApiWithLoading.js";
import { useApi } from "../../hooks/useApi.js";
import ClassesDrawerForm from "../../components/form/forms/ClassesDrawerForm.jsx";
import DrawerNewItemButton from "../../components/form/DrawerNewItemButton.jsx";
import ContentBlockBreadcrumb from "../../components/content/ContentBlockBreadcrumb.jsx";

const { Text } = Typography;

function EditScheduleClasses() {
    const { t } = useTranslation();
    const { currentFieldOfStudyInfo } = useUser();
    const { handleApiError, displayMessage } = useNotification();
    const [rows, setRows] = useState([]);
    const [selectedRow, setSelectedRow] = useState({});

    const prepareCreatePayload = useCallback(
        function (values) {
            return {
                fieldOfStudyLogId: currentFieldOfStudyInfo?.fieldOfStudyLogId,
                name: values.className,
                room: values.classRoom,
                isOddWeek: JSON.parse(values.isOddWeek),
                weekDay: values.weekDay,
                groupId: values.groupId,
                startHourId: values.startHourId,
                endHourId: values.endHourId
            };
        },
        [currentFieldOfStudyInfo?.fieldOfStudyLogId]
    );

    const prepareUpdatePayload = useCallback(
        function (values) {
            return {
                fieldOfStudyLogId: currentFieldOfStudyInfo?.fieldOfStudyLogId,
                name: values.className,
                room: values.classRoom,
                dates: values.dates.map((day) => day.format("YYYY-MM-DD")),
                weekDay: values.weekDay,
                groupId: values.groupId,
                startHourId: values.startHourId,
                endHourId: values.endHourId
            };
        },
        [currentFieldOfStudyInfo?.fieldOfStudyLogId]
    );

    const renderModalContent = useCallback(
        (record) => (
            <>
                {t("class-name")}: <Text strong>{record.className}</Text>
                <br />
            </>
        ),
        [t]
    );

    const onCreateRequest = useApi(
        createClass,
        () => getClassesRequest(currentFieldOfStudyInfo?.fieldOfStudyLogId),
        handleApiError
    );

    const handleCreate = useCallback(
        async function (values) {
            await onCreateRequest(prepareCreatePayload(values));
        },
        [onCreateRequest, prepareCreatePayload]
    );

    const onEditRequest = useApi(
        updateClass,
        () => getClassesRequest(currentFieldOfStudyInfo?.fieldOfStudyLogId),
        handleApiError
    );

    const handleEdit = useCallback(
        async function (values) {
            await onEditRequest(values.key, prepareUpdatePayload(values));
        },
        [onEditRequest, prepareUpdatePayload]
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
        <ContentBlockBreadcrumb currentPath={t("classes")}>
            <Flex
                gap="small"
                style={{ paddingBottom: "1rem", flexDirection: "row-reverse" }}
            >
                <DrawerNewItemButton label={t("create-class")} />
            </Flex>
            <ClassesDrawerForm
                onCreate={handleCreate}
                onEdit={handleEdit}
                initialValues={selectedRow}
            />
            <TableWithActions
                columns={columns}
                rows={rows}
                loading={isLoading}
                modalRenderConfirmContent={renderModalContent}
                onDelete={(row) => deleteClassRequest(row.id)}
                onEdit={(row) => setSelectedRow(row)}
            />
        </ContentBlockBreadcrumb>
    );
}

export default EditScheduleClasses;
