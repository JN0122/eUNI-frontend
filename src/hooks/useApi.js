import { useCallback } from "react";

export function useApi(apiCall, onSuccess, onError) {
    const handleApiCall = useCallback(
        async (...args) => {
            try {
                const response = await apiCall(...args);
                return onSuccess(response.data);
            } catch (e) {
                return onError(e);
            }
        },
        [apiCall, onError, onSuccess]
    );

    return handleApiCall;
}
