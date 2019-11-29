export function getHash(settings: { parseInt?: boolean } = {}): any {
    if (!document.location.hash) return null;
    let value = decodeURIComponent(document.location.hash.substring(1));
    if (settings.parseInt) return parseInt(value.replace(/\D+/g, ''));
    return value;
}