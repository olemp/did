/**
 * Get duration display
 * 
 * @param {number} minutes Minutes
 * @param {number} hours Hours
 */
export function getDurationDisplay(minutes: number, hours?: number): string {
    let hrs = hours ? Math.floor(hours) : Math.floor(minutes / 60);
    let mins = hours ? ((hours % 1) * 60) : minutes % 60;
    return [hrs && `${hrs} hours`, mins && `${mins} minutes`].filter(c => c).join(', ');
}

/**
 * Get url parameter
 * 
 * @param {string} name Name
 * @param {string} fallbackValue Fallback value
 */
export function getUrlParameter(name: string, fallbackValue: string = null): string {
    return new URL(document.location.href).searchParams.get(name) || fallbackValue;
}

/**
 * Converts string to array buffer
 * 
 * @param {string} str String
 */
export function stringToArrayBuffer(str: string) {
    const buf = new ArrayBuffer(str.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== str.length; ++i) {
        view[i] = str.charCodeAt(i) & 0xFF;
    }
    return buf;
}