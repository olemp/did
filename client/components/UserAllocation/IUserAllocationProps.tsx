import { TypedHash } from '@pnp/common';

export interface IUserAllocationChart {
    column: string;
    title: string;
}

export interface IUserAllocationProps {
    userId?: string;
    charts: TypedHash<string>;
}
