
import * as arraySort from 'array-sort';
import { IGroup } from 'office-ui-fabric-react/lib/DetailsList';
import { getValueTyped as value } from 'helpers';
import * as _ from 'underscore';

/**
 * Create groups
 * 
 * @param {any[]} items Items
 * @param {string} groupBy Group by field name
 * @param {string[]} uniqueGroupNames Group names
 */
export function createGroups(items: any[], groupBy: string, uniqueGroupNames: string[]): { items: any[], groups: IGroup[] } {
    const itemsSort = { props: [groupBy], opts: { reverse: false } };
    items = arraySort([...items], itemsSort.props, itemsSort.opts);
    let groupNames = items.map(g => value<string>(g, groupBy, ''));
    uniqueGroupNames = uniqueGroupNames || _.uniq(groupNames).sort((a, b) => a > b ? 1 : -1);
    const groups = uniqueGroupNames.map((name, idx) => {
        const count = groupNames.filter(n => n === name).length;
        const group: IGroup = {
            key: idx.toString(),
            name,
            startIndex: groupNames.indexOf(name, 0),
            count,
            isShowingAll: count === items.length,
            isDropEnabled: false,
            isCollapsed: false,
        };
        return group;
    });
    return { groups, items };
}