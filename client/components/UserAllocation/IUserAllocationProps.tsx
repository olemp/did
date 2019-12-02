import { TypedHash } from '@pnp/common';

export interface IUserAllocationChart {
    column: string;
    title: string;
}

export interface IUserAllocationProps {
    resourceId?: string;
    currentUser?: boolean;
    weekNumber?: number;
    yearNumber?: number;
    charts: TypedHash<string>;
}
