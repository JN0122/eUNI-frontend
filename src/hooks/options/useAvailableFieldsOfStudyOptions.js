import { getAvailableFields } from "../../api/admin.js";
import { useApi } from "../useApi.js";
import { useEffect, useState } from "react";
import { useNotification } from "../useNotification.jsx";
import useStudiesCycleOptions from "./useStudiesCycleOptions.js";
import useModeOfStudyOptions from "./useModeOfStudyOptions.js";

export default function useAvailableFieldsOfStudyOptions() {
    const [data, setData] = useState({});

    const { handleApiError } = useNotification();
    const studiesCycle = useStudiesCycleOptions();
    const modeOfStudy = useModeOfStudyOptions();

    const getAvailableFieldsOfStudyRequest = useApi(
        getAvailableFields,
        (data) =>
            setData(
                data.map((row) => {
                    row.studiesCycleParsed = studiesCycle.find(
                        (value) => value.value === row.studiesCycle
                    ).label;
                    row.fullTime = row.fullTime.toString();
                    row.fullTimeParsed = modeOfStudy.find(
                        (value) => value.value === row.fullTime
                    ).label;
                    return {
                        label: [
                            row.name,
                            row.studiesCycleParsed,
                            row.fullTimeParsed
                        ].join(" > "),
                        value: row.id
                    };
                })
            ),
        handleApiError
    );

    useEffect(() => {
        getAvailableFieldsOfStudyRequest();
    }, []);

    return data;
}
