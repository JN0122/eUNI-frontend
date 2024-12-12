import { useEffect, useState } from "react";
import { useApi } from "../useApi.js";
import { getFieldsRequirements } from "../../api/admin.js";
import { useNotification } from "../useNotification.jsx";

export default function useFieldOfStudyUpgradeRequirements() {
    const { handleApiError } = useNotification();
    const [data, setData] = useState({});
    const getFieldRequirements = useApi(
        getFieldsRequirements,
        (data) => setData(data),
        handleApiError
    );
    
    useEffect(() => {
        getFieldRequirements();
    }, []);

    return data;
}
