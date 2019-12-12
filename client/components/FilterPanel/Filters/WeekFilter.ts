import { getValueTyped as value } from 'helpers';
import * as _ from 'underscore';
import { BaseFilter } from "./BaseFilter";

/**
 * @class WeekFilter
 * @inherits BaseFilter
 */
export class WeekFilter extends BaseFilter {
    constructor(fieldName: string, name: string) {
        super(fieldName, name);
    }

    /**
     * Intialize the WeekFilter
     * 
     * @param {any[]} entries Entries
     */
    public initialize(entries: any[]) {
        const weeks = _.unique(entries.map(e => value(e, this.fieldName, null))).sort((a, b) => a - b);
        const items = weeks.map(week => ({
            key: week,
            value: week,
        }));
        return { key: this.fieldName, name: this.name, items, selected: [] }
    }
}