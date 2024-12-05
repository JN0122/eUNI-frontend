import { useCallback } from "react";
import { useAuth } from "./useAuth.jsx";

export function useApi(
    apiCall,
    onSuccess,
    onError,
    tryToRestoreSession = true
) {
    const { restoreSession } = useAuth();

    const restoreSessionAndRetry = useCallback(
        async function (...args) {
            try {
                await restoreSession();
                const response = await apiCall(...args);
                return onSuccess(response.data);
            } catch (e) {
                return onError(e);
            }
        },
        [apiCall, onError, onSuccess, restoreSession]
    );

    return useCallback(
        async (...args) => {
            try {
                const response = await apiCall(...args);
                return onSuccess(response.data);
            } catch (e) {
                if (e.status !== 401 || !tryToRestoreSession) return onError(e);
                await restoreSessionAndRetry(...args);
            }
        },
        [
            apiCall,
            onError,
            onSuccess,
            restoreSessionAndRetry,
            tryToRestoreSession
        ]
    );
}
