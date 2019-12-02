
import { useQuery } from '@apollo/react-hooks';
import { List } from 'components/List';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as React from 'react';
import GET_DATA from './GET_DATA';
import { Reports } from './Reports';
import { USER_LIST_COLUMNS } from './USER_LIST_COLUMNS';
import { WEEK_LIST_COLUMNS } from './WEEK_LIST_COLUMNS';

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
                    <List enableShimmer={loading} items={data && data.users} columns={USER_LIST_COLUMNS} />
                </PivotItem>
                <PivotItem itemKey='weeks' headerText='Weeks' itemIcon='CalendarWeek' style={{ padding: 10 }}>
                    <List enableShimmer={loading} items={data && data.weeks} columns={WEEK_LIST_COLUMNS} />
                </PivotItem>
            </Pivot>
        </div>
    );
}