import { App } from "antd";
import getNotificationConfig from "../helpers/getNotificationConfig.js";
import NOTIFICATION_TYPES from "../enums/NotificationTypes.js";
import apiStatusTranslationCode from "../helpers/apiStatusTranslationCode.js";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";

export function useNotification() {
    const { notification, message } = App.useApp();
    const { t } = useTranslation();

    const displayNotification = useCallback(
        function (message, type = NOTIFICATION_TYPES.success) {
            switch (type) {
                case NOTIFICATION_TYPES.success:
                    notification.success(getNotificationConfig(message));
                    break;
                case NOTIFICATION_TYPES.error:
                    notification.error(getNotificationConfig(message));
                    break;
            }
        },
        [notification]
    );

    const displayMessage = useCallback(
        function (text, type) {
            switch (type) {
                case NOTIFICATION_TYPES.success:
                    message.open({
                        type: "success",
                        content: text
                    });
                    break;
                case NOTIFICATION_TYPES.error:
                    message.open({
                        type: "error",
                        content: text
                    });
                    break;
            }
        },
        [message]
    );

    const handleApiError = useCallback(
        function (error) {
            displayNotification(
                t(apiStatusTranslationCode(error.status)),
                NOTIFICATION_TYPES.error
            );
        },
        [displayNotification, t]
    );

    return { displayNotification, displayMessage, handleApiError };
}
