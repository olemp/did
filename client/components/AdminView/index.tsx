
import { useQuery } from '@apollo/react-hooks';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as React from 'react';
import { AdminSummaryView } from './AdminSummaryView';
import { Users } from './Users';
import GET_USERS from './Users/GET_USERS';

function getPath(): string[] {
    let [, path] = document.location.hash.substring(1).split('=');
    return (path || '').split('/');
}

/**
 * @component AdminView
 * @description
 */
export const AdminView = () => {
    let path = getPath();

    const onLinkClick = (item: PivotItem) => document.location.hash = `#path=${item.props.itemID}`;

    const linkStyle = { padding: 10 };

    return (
        <div className='c-AdminView'>
            <Pivot onLinkClick={onLinkClick} defaultSelectedKey={path[0]}>
                <PivotItem itemID='users' itemKey='users' headerText='Users' itemIcon='FabricUserFolder' style={linkStyle}>
                    <Users />
                </PivotItem>
                <PivotItem itemID='summary' itemKey='summary' headerText='Summary' itemIcon='CalendarWeek' style={linkStyle}>
                    <AdminSummaryView defaultRange={3} />
                </PivotItem>
            </Pivot>
        </div>
    );
}