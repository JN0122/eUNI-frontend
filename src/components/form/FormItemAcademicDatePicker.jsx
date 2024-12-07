import { Skeleton } from "antd";
import { useCallback } from "react";
import { useAcademicYearDaysOff } from "../../hooks/options/useDaysOff.js";
import FormItemDatePicker from "./FormItemDatePicker.jsx";

export function FormItemAcademicDatePicker({
    fieldOfStudyLogId,
    name,
    label,
    isRequired,
    ...rest
}) {
    const academicYearDaysOff = useAcademicYearDaysOff(fieldOfStudyLogId);

    const disabledDate = useCallback(
        (current) => {
            return (
                current &&
                (current < academicYearDaysOff?.yearStartDate ||
                    current > academicYearDaysOff?.yearEndDate ||
                    academicYearDaysOff?.daysOff.find((v) => v.isSame(current)))
            );
        },
        [academicYearDaysOff]
    );

    if (academicYearDaysOff.length === 0)
        return <Skeleton.Input active={true} />;

    return (
        <FormItemDatePicker
            name={name}
            label={label}
            isRequired={isRequired}
            disabledDate={disabledDate}
            multiple
            {...rest}
        />
    );
}
