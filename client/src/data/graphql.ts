import axiosadapter from './axiosadapter';
import { TypedHash } from '@pnp/common';

export default new class GraphQL {
    private _adapter: axiosadapter;

    constructor() {
        this._adapter = new axiosadapter('graphql', 10000);
    }

    public async query<T>(query: string, variables: TypedHash<any> = {}): Promise<T> {
        return (await this._adapter.post(undefined, { query, variables })).data;
    }
}