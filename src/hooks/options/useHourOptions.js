import { useCallback, useEffect, useMemo, useState } from "react";
import { getHours } from "../../api/schedule.js";
import { useApi } from "../useApi.jsx";
import { useNotification } from "../useNotification.jsx";

export default function useHourOptions() {
    const [hours, setHours] = useState([]);
    const { handleApiError } = useNotification();

    const getHoursRequest = useApi(
        getHours,
        (data) => {
            setHours(data);
        },
        handleApiError
    );

    useEffect(() => {
        getHoursRequest();
    }, []);

    const getHourOptions = useCallback(
        (value) => {
            if (hours === null) return null;
            return hours.map((hour) => {
                return { label: hour[value], value: hour.hourId };
            });
        },
        [hours]
    );

    const startHourOptions = useMemo(() => {
        return getHourOptions("startTime");
    }, [getHourOptions]);

    const endHourOptions = useMemo(() => {
        return getHourOptions("endTime");
    }, [getHourOptions]);

    return { startHourOptions, endHourOptions };
}
