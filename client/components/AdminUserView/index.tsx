
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
            <UserAllocation userId={userId} charts={{ projectKey: 'Allocation per project 2019', customerKey: 'Allocation per customer 2019' }} />
        </div>
    );
}