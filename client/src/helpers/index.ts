/**
 * Get duration display
 * 
 * @param {number} minutes Minutes
 */
export function getDurationDisplay(minutes: number): string {
    let hrs = Math.floor(minutes / 60);
    let mins = minutes % 60;
    return [hrs && `${hrs} hours`, mins && `${mins} minutes`].filter(c => c).join(', ');
}

/**
 * Get url parameter
 */
export function getUrlParameter(name: string): string {
    return new URL(document.location.href).searchParams.get(name);
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