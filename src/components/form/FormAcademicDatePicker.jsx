import { DatePicker, Skeleton } from "antd";
import { FormCustomItem } from "./FormCustomItem.jsx";
import { useCallback } from "react";
import { useAcademicYearDaysOff } from "../../hooks/options/useDaysOff.js";

export function FormAcademicDatePicker({
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
        <FormCustomItem name={name} label={label} isRequired={isRequired}>
            <DatePicker
                disabledDate={disabledDate}
                needConfirm
                multiple
                {...rest}
            />
        </FormCustomItem>
    );
}
