export default function apiStatusTranslationCode(status) {
    let message = "error-could-not-connect-to-api";
    switch (status) {
        case 400:
            message = "error-bad-request";
            break;
        case 401:
            message = "error-unauthorized";
            break;
        case 403:
            message = "error-forbidden";
            break;
        case 404:
            message = "error-not-found";
            break;
        case 500:
            message = "error-unexpected";
            break;
    }
    return message;
}
