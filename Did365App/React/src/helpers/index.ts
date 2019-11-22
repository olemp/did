/**
 * Get duration display
 * 
 * @param {number} minutes Minutes
 */
export function getDurationDisplay(minutes: number): string {
    let hrs = Math.floor(minutes / 60);
    let mins = minutes % 60;
    return [hrs && `${hrs} hours`, mins &&`${mins} minutes`].filter(c => c).join(', ');
}