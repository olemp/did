export function getHash(settings: { parseInt?: boolean } = {}): any {
    let value: string = document.location.hash ? decodeURIComponent(document.location.hash.substring(1)) : null;
    if (settings.parseInt) return parseInt(value.replace(/\D+/g, ''));
    return value;
}