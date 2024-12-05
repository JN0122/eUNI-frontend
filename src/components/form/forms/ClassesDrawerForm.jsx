import { FormItemInput } from "../FormItemInput.jsx";
import { FormItemSelect } from "../FormItemSelect.jsx";
import { DRAWER_TYPE, useDrawer } from "../../../hooks/useDrawer.jsx";
import { FormItemAcademicDatePicker } from "../FormItemAcademicDatePicker.jsx";
import { useTranslation } from "react-i18next";
import useHourOptions from "../../../hooks/options/useHourOptions.js";
import { useGroupOptions } from "../../../hooks/options/useGroupOptions.js";
import { useWeekOptions } from "../../../hooks/options/useWeekOptions.js";
import FormDrawer from "../FormDrawer.jsx";
import { useUser } from "../../../hooks/useUser.jsx";

export default function ClassesDrawerForm({ onCreate, onEdit, ...rest }) {
    const { currentFieldOfStudyInfo } = useUser();
    const { type } = useDrawer();
    const { t } = useTranslation();

    const { startHourOptions, endHourOptions } = useHourOptions();
    const groupOptions = useGroupOptions(
        currentFieldOfStudyInfo?.fieldOfStudyLogId
    );
    const { weekDayOptions, oddWeekOptions } = useWeekOptions(
        currentFieldOfStudyInfo?.isFullTime
    );

    return (
        <FormDrawer
            title={{
                create: t("create-class"),
                edit: t("edit-class")
            }}
            onSubmit={{
                create: onCreate,
                edit: onEdit
            }}
            {...rest}
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
        </FormDrawer>
    );
}
