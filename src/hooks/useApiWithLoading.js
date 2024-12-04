import { useState } from "react";
import { useApi } from "./useApi.js";

export function useApiWithLoading(apiCall, onSuccess, onError) {
    const [loading, setLoading] = useState(false);
    const apiCallRequest = useApi(apiCall, onSuccess, onError);

    const apiCallRequestWithLoading = async (...args) => {
        setLoading(true);
        await apiCallRequest(...args);
        setLoading(false);
    };

    return [apiCallRequestWithLoading, loading];
}
