import { useNotification } from "../useNotification.jsx";
import { getYearOrganizations } from "../../api/admin.js";
import { useEffect, useState } from "react";
import { useApi } from "../useApi.js";
import useSemesterTypesOptions from "./useSemesterTypesOptions.js";

export default function useOrganizationOptions() {
    const { handleApiError } = useNotification();
    const [data, setData] = useState([]);
    const semesterTypesOptions = useSemesterTypesOptions();

    const getYearOrganizationsRequest = useApi(
        getYearOrganizations,
        (data) =>
            setData(
                data.map((organization) => {
                    const semesterType = semesterTypesOptions.find(
                        (type) =>
                            type.value ===
                            organization.firstHalfOfYear.toString()
                    ).label;
                    return {
                        value: organization.id,
                        label: [organization.yearName, semesterType].join(" > ")
                    };
                })
            ),
        handleApiError
    );

    useEffect(() => {
        getYearOrganizationsRequest();
    }, []);

    return data;
}
