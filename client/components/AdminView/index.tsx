
import { useQuery } from '@apollo/react-hooks';
import { List } from 'components/List';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as React from 'react';
import { generateColumn } from 'utils/generateColumn';
import GET_DATA from './GET_DATA';
import { Reports } from './Reports';
import { WeekStatusColumn } from './WeekStatusColumn';

const WEEK_LIST_COLUMNS = [
    generateColumn('id', 'Week number', { maxWidth: 150 }),
    generateColumn('closed', undefined, undefined, (week: any) => <WeekStatusColumn weekNumber={parseInt(week.id)} closed={week.closed} />)
];

const USER_LIST_COLUMNS = [
    generateColumn('fullName', 'Name', { maxWidth: 180 }, (user: any) => <a href={`/admin/users/${user.id}`}>{user.fullName}</a>),
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
            <Pivot defaultSelectedKey='reports'>
                <PivotItem itemKey='reports' headerText='Reports' itemIcon='ReportDocument' style={{ padding: 10 }}>
                    <Reports />
                </PivotItem>
                <PivotItem itemKey='users' headerText='Users' itemIcon='FabricUserFolder' style={{ padding: 10 }}>
                    <List
                        enableShimmer={loading}
                        items={data && data.users}
                        columns={USER_LIST_COLUMNS} />
                </PivotItem>
                <PivotItem itemKey='weeks' headerText='Weeks' itemIcon='CalendarWeek' style={{ padding: 10 }}>
                    <List
                        enableShimmer={loading}
                        items={data && data.weeks}
                        columns={WEEK_LIST_COLUMNS} />
                </PivotItem>
            </Pivot>
        </div>
    );
}