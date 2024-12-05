import { useCallback, useState } from "react";
import { useApi } from "./useApi.js";

export function useApiWithLoading(
    apiCall,
    onSuccess,
    onError,
    tryToRestoreSession = true
) {
    const [loading, setLoading] = useState(false);
    const apiCallRequest = useApi(
        apiCall,
        onSuccess,
        onError,
        tryToRestoreSession
    );

    const apiCallRequestWithLoading = useCallback(
        async (...args) => {
            setLoading(true);
            await apiCallRequest(...args);
            setLoading(false);
        },
        [apiCallRequest]
    );

    return [apiCallRequestWithLoading, loading];
}
