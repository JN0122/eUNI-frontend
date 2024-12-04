import { useCallback, useEffect, useState } from "react";
import { useNotification } from "../useNotification.jsx";
import { getGroups } from "../../api/fieldOfStudy.js";
import { useApi } from "../useApi.js";

export default function useFieldOfStudyGroupsOptions(fieldOfStudyLogId) {
    const { handleApiError } = useNotification();
    const [groupsOptions, setGroupsOptions] = useState(null);

    const parseGroups = useCallback(function (data) {
        const groups = {};
        data.map((data) => {
            const newGroup = {
                label: data.groupName,
                value: data.groupId
            };
            groups[data.type] =
                groups[data.type] === undefined
                    ? [newGroup]
                    : [...groups[data.type], newGroup];
        });
        setGroupsOptions(groups);
    }, []);

    const callApi = useApi(getGroups, parseGroups, handleApiError);

    useEffect(() => {
        if (fieldOfStudyLogId == null) return;
        callApi(fieldOfStudyLogId);
    }, [callApi, fieldOfStudyLogId]);

    return groupsOptions;
}
