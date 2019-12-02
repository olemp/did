import * as React from 'react';
import { generateColumn } from 'utils/generateColumn';

export const USER_LIST_COLUMNS = [
    generateColumn('fullName', 'Name', { maxWidth: 180 }, (user: any) => <a href={`/admin/users/${user.id}`}>{user.fullName}</a>),
    generateColumn('role', 'Role')
];