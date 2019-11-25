import { DataAdapter } from './';
import { TypedHash } from '@pnp/common';

export default new class GraphQL {
    private _adapter: DataAdapter;

    constructor() {
        this._adapter = new DataAdapter('graphql');
    }

    public async query<T>(query: string, variables: TypedHash<string | number> = {}): Promise<T> {
        return (await this._adapter.post(undefined, { query, variables })).data;
    }
}