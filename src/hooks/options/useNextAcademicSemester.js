import { useEffect, useState } from "react";
import { useNotification } from "../useNotification.jsx";
import { useApi } from "../useApi.js";
import { getNextAcademicYearDetails } from "../../api/admin.js";

export default function useNextAcademicSemester() {
    const { handleApiError } = useNotification();
    const [academicYearDetails, setAcademicYearDetails] = useState({});

    const getNextAcademicSemesterRequest = useApi(
        getNextAcademicYearDetails,
        (details) =>
            setAcademicYearDetails(() => {
                return {
                    yearId: details.yearId,
                    firstHalfOfYear: details.firstHalfOfYear.toString()
                };
            }),
        handleApiError
    );

    useEffect(() => {
        getNextAcademicSemesterRequest();
    }, []);

    return academicYearDetails;
}
