export function getErrorTranslationCode(prefix, status) {
    let translationMessage;
    switch (status) {
        case 500:
            translationMessage = "error-unexpected";
            break;
        case undefined:
            translationMessage = "error-connection-refused";
            break;
        default:
            translationMessage = `error-login-${status}`;
    }
    return translationMessage;
}
