import { DRAWER_TYPE, useDrawer } from "../../hooks/useDrawer.jsx";
import { useTranslation } from "react-i18next";
import DataDrawer from "../../components/content/DataDrawer.jsx";
import { useUser } from "../../hooks/useUser.jsx";
import { FormInput } from "../../components/form/FormInput.jsx";
import { FormSelect } from "../../components/form/FormSelect.jsx";
import useHourOptions from "../../hooks/options/useHourOptions.js";
import { useGroupOptions } from "../../hooks/options/useGroupOptions.js";
import { useWeekOptions } from "../../hooks/options/useWeekOptions.js";
import { FormAcademicDatePicker } from "../../components/form/FormAcademicDatePicker.jsx";
import { useNotification } from "../../hooks/useNotification.jsx";
import { useCallback } from "react";
import { useApi } from "../../hooks/useApi.jsx";
import { createClass, updateClass } from "../../api/representative.js";

function ClassesDrawer({ selectedRow }) {
    const { type } = useDrawer();
    const { currentFieldOfStudyInfo } = useUser();
    const { t } = useTranslation();
    const { handleApiError } = useNotification();

    const { startHourOptions, endHourOptions } = useHourOptions();
    const groupOptions = useGroupOptions(
        currentFieldOfStudyInfo?.fieldOfStudyLogId
    );
    const { weekDayOptions, oddWeekOptions } = useWeekOptions(
        currentFieldOfStudyInfo?.isFullTime
    );

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
        <DataDrawer
            title={{
                create: t("create-assignment"),
                edit: t("edit-assignment")
            }}
            onSubmit={{
                create: handleCreate,
                edit: handleEdit
            }}
            initialValues={selectedRow}
        >
            <FormInput
                name="className"
                label={t("classes")}
                placeholder={t("enter-class-name")}
                isRequired={true}
            />
            <FormInput
                name="classRoom"
                label={t("room")}
                placeholder={t("enter-room")}
                isRequired={true}
            />
            <FormSelect
                name="groupId"
                label={t("group-name")}
                options={groupOptions}
                isRequired={true}
            />
            {type === DRAWER_TYPE.create ? (
                <>
                    <FormSelect
                        name="isOddWeek"
                        label={t("class-repeatability")}
                        options={oddWeekOptions}
                        isRequired={true}
                    />
                    <FormSelect
                        name="weekDay"
                        label={t("week-day")}
                        options={weekDayOptions}
                        isRequired={true}
                    />
                </>
            ) : (
                <FormAcademicDatePicker
                    name="dates"
                    label={t("class-dates")}
                    isRequired={true}
                    fieldOfStudyLogId={
                        currentFieldOfStudyInfo?.fieldOfStudyLogId
                    }
                />
            )}
            <FormSelect
                name="startHourId"
                label={t("start-hour")}
                options={startHourOptions}
                isRequired={true}
            />
            <FormSelect
                name="endHourId"
                label={t("end-hour")}
                options={endHourOptions}
                isRequired={true}
            />
        </DataDrawer>
    );
}

export default ClassesDrawer;
