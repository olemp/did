
import { useQuery } from '@apollo/react-hooks';
import { List } from 'components/List';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import * as React from 'react';
import { useState } from 'react';
import { generateColumn } from 'utils/generateColumn';
import GET_DATA from './GET_DATA';

const WeekClosedColumn = ({ week, closed }) => {
    const [isClosed, setIsClosed] = useState(closed);

    return (
        <span title={isClosed ? 'The week is closed by an administrator. Click to open it.' : 'The week is open for everyone. Click to close it.'}>
            <a href='#' onClick={_ => setIsClosed(!isClosed)}>
                <Icon iconName={isClosed ? 'LockSolid' : 'OpenEnrollment'} />
            </a>
        </span>
    );
}

const WEEK_LIST_COLUMNS = [
    generateColumn('id', 'Week number', { maxWidth: 150 }),
    generateColumn('closed', undefined, undefined, (item: any) => <WeekClosedColumn week={item.id} closed={item.closed} />)
];

const USER_LIST_COLUMNS = [
    generateColumn('id', 'ID', { maxWidth: 180 }),
    generateColumn('fullName', 'Name', { maxWidth: 180 }),
    generateColumn('role', 'Role')
];

/**
 * @component AdminView
 * @description @todo
 */
export const AdminView = ({ }) => {
    const { data, loading } = useQuery(GET_DATA);

    return (
        <div>
            <Pivot defaultSelectedKey='users'>
                <PivotItem itemKey='users' headerText='Users' itemIcon='FabricUserFolder'>
                    <List
                        enableShimmer={loading}
                        items={data && data.users}
                        columns={USER_LIST_COLUMNS} />
                </PivotItem>
                <PivotItem itemKey='weeks' headerText='Weeks' itemIcon='CalendarWeek'>
                    <List
                        enableShimmer={loading}
                        items={data && data.weeks}
                        columns={WEEK_LIST_COLUMNS} />
                </PivotItem>
            </Pivot>
        </div>
    );
}