import { useEffect, useState } from "react";
import { useApi } from "../useApi.js";
import { getYears } from "../../api/admin.js";
import { useNotification } from "../useNotification.jsx";

export default function useAcademicYears() {
    const { handleApiError } = useNotification();
    const [years, setYears] = useState([]);
    const getYearsRequest = useApi(
        getYears,
        (years) =>
            setYears(
                years.map((year) => {
                    return {
                        label: year.name,
                        value: year.id
                    };
                })
            ),
        handleApiError
    );

    useEffect(() => {
        getYearsRequest();
    }, []);

    return years;
}
