
import * as React from 'react';
import { IAdminUserViewProps } from './IAdminUserViewProps';
import { UserAllocation } from 'components/UserAllocation';

/**
 * @component AdminUserView
 * @description
 * @todo
 */
export const AdminUserView = ({ userId }: IAdminUserViewProps) => {
    return (
        <div>
            <UserAllocation resourceId={userId} charts={{ 'project.name': 'Allocation per project 2019', 'customer.name': 'Allocation per customer 2019' }} />
        </div>
    );
}