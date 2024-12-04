import { DRAWER_TYPE, useDrawer } from "../../hooks/useDrawer.jsx";
import { useTranslation } from "react-i18next";
import DataDrawer from "../../components/content/DataDrawer.jsx";
import { useUser } from "../../hooks/useUser.jsx";
import { FormItemInput } from "../../components/form/FormItemInput.jsx";
import { FormItemSelect } from "../../components/form/FormItemSelect.jsx";
import useHourOptions from "../../hooks/options/useHourOptions.js";
import { useGroupOptions } from "../../hooks/options/useGroupOptions.js";
import { useWeekOptions } from "../../hooks/options/useWeekOptions.js";
import { FormItemAcademicDatePicker } from "../../components/form/FormItemAcademicDatePicker.jsx";
import { useNotification } from "../../hooks/useNotification.jsx";
import { useCallback } from "react";
import { useApi } from "../../hooks/useApi.js";
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
            <FormItemInput
                name="className"
                label={t("classes")}
                placeholder={t("enter-class-name")}
                isRequired={true}
            />
            <FormItemInput
                name="classRoom"
                label={t("room")}
                placeholder={t("enter-room")}
                isRequired={true}
            />
            <FormItemSelect
                name="groupId"
                label={t("group-name")}
                options={groupOptions}
                isRequired={true}
            />
            {type === DRAWER_TYPE.create ? (
                <>
                    <FormItemSelect
                        name="isOddWeek"
                        label={t("class-repeatability")}
                        options={oddWeekOptions}
                        isRequired={true}
                    />
                    <FormItemSelect
                        name="weekDay"
                        label={t("week-day")}
                        options={weekDayOptions}
                        isRequired={true}
                    />
                </>
            ) : (
                <FormItemAcademicDatePicker
                    name="dates"
                    label={t("class-dates")}
                    isRequired={true}
                    fieldOfStudyLogId={
                        currentFieldOfStudyInfo?.fieldOfStudyLogId
                    }
                />
            )}
            <FormItemSelect
                name="startHourId"
                label={t("start-hour")}
                options={startHourOptions}
                isRequired={true}
            />
            <FormItemSelect
                name="endHourId"
                label={t("end-hour")}
                options={endHourOptions}
                isRequired={true}
            />
        </DataDrawer>
    );
}

export default ClassesDrawer;
