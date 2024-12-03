import { useCallback, useState } from "react";

export function useApi(apiCall, onSuccess, onError) {
    const [isLoading, setIsLoading] = useState(false);

    const handleApiCall = useCallback(
        async (...args) => {
            setIsLoading(true);
            try {
                const response = await apiCall(...args);
                setIsLoading(false);
                return onSuccess(response.data);
            } catch (e) {
                setIsLoading(false);
                return onError(e);
            }
        },
        [apiCall, onError, onSuccess]
    );

    return [handleApiCall, isLoading];
}
