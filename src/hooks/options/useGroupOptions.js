import { useEffect, useState } from "react";
import { getAllGroups } from "../../api/representative.js";
import { useNotification } from "../useNotification.jsx";
import { useApi } from "../useApi.jsx";

export function useGroupOptions(fieldOfStudyLogId) {
    const [groupOptions, setGroupOptions] = useState([]);
    const { handleApiError } = useNotification();

    const getAllGroupsRequest = useApi(
        getAllGroups,
        (data) =>
            setGroupOptions(
                data.map((group) => {
                    return { value: group.groupId, label: group.groupName };
                })
            ),
        handleApiError
    );

    useEffect(() => {
        if (!fieldOfStudyLogId) return;
        getAllGroupsRequest(fieldOfStudyLogId);
    }, []);

    return groupOptions;
}
