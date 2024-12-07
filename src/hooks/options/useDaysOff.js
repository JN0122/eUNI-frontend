import { useEffect, useState } from "react";
import { getAcademicDaysOff } from "../../api/representative.js";
import dayjs from "dayjs";
import { useNotification } from "../useNotification.jsx";
import { useApi } from "../useApi.js";

export function useAcademicYearDaysOff(fieldOfStudyLogId) {
    const [academicYearDaysOff, setAcademicYearDaysOff] = useState([]);
    const { handleApiError } = useNotification();

    const getAcademicDaysOffRequest = useApi(
        getAcademicDaysOff,
        (data) =>
            setAcademicYearDaysOff({
                yearStartDate: dayjs(data.startYearDate),
                yearEndDate: dayjs(data.endYearDate),
                daysOff: data.daysOff.map((date) => dayjs(date))
            }),
        handleApiError
    );

    useEffect(() => {
        if (!fieldOfStudyLogId) return;
        getAcademicDaysOffRequest(fieldOfStudyLogId);
    }, [fieldOfStudyLogId]);

    return academicYearDaysOff;
}
