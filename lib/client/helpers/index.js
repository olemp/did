/**
 * Get duration display
 *
 * @param {number} minutes Minutes
 * @param {number} hours Hours
 */
export function getDurationDisplay(minutes, hours) {
    var hrs = hours ? Math.floor(hours) : Math.floor(minutes / 60);
    var mins = hours ? ((hours % 1) * 60) : minutes % 60;
    return [hrs && hrs + " hours", mins && mins + " minutes"].filter(function (c) { return c; }).join(', ');
}
/**
 * Get url parameter
 *
 * @param {string} name Name
 * @param {string} fallbackValue Fallback value
 */
export function getUrlParameter(name, fallbackValue) {
    if (fallbackValue === void 0) { fallbackValue = null; }
    return new URL(document.location.href).searchParams.get(name) || fallbackValue;
}
/**
 * Converts string to array buffer
 *
 * @param {string} str String
 */
export function stringToArrayBuffer(str) {
    var buf = new ArrayBuffer(str.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i !== str.length; ++i) {
        view[i] = str.charCodeAt(i) & 0xFF;
    }
    return buf;
}
//# sourceMappingURL=index.js.map