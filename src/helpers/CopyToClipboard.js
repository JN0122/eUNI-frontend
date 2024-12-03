export function CopyToClipboard(text, onSuccess, onError) {
    navigator.clipboard.writeText(text).then(onSuccess).catch(onError);
}
