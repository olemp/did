/**
 * Get hash
 * 
 * @param {Object} options Options
 */
export function getHash(options: { parseInt?: boolean } = {}): any {
    if (!document.location.hash) return null;
    let value = decodeURIComponent(document.location.hash.substring(1));
    if (options.parseInt) return parseInt(value.replace(/\D+/g, ''));
    return value;
}