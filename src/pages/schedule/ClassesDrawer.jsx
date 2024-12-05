import { useUser } from "../../hooks/useUser.jsx";
import { useNotification } from "../../hooks/useNotification.jsx";
import { useCallback } from "react";
import { useApi } from "../../hooks/useApi.js";
import { createClass, updateClass } from "../../api/representative.js";
import ClassesDrawerForm from "../../components/form/forms/ClassesDrawerForm.jsx";

function ClassesDrawer({ selectedRow }) {
    const { currentFieldOfStudyInfo } = useUser();
    const { handleApiError } = useNotification();

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

    const onCreateRequest = useApi(createClass, () => {}, handleApiError);

    const handleCreate = useCallback(
        async function (values) {
            await onCreateRequest(prepareCreatePayload(values));
        },
        [onCreateRequest, prepareCreatePayload]
    );

    const onEditRequest = useApi(updateClass, () => {}, handleApiError);

    const handleEdit = useCallback(
        async function (values) {
            await onEditRequest(values.key, prepareUpdatePayload(values));
        },
        [onEditRequest, prepareUpdatePayload]
    );

    return (
        <ClassesDrawerForm
            onCreate={handleCreate}
            onEdit={handleEdit}
            initialValues={selectedRow}
        />
    );
}

export default ClassesDrawer;
