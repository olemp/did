import axiosadapter from './axiosadapter';
import { TypedHash, PnPClientStorage, PnPClientStore, dateAdd } from '@pnp/common';

export default new class GraphQL {
    private _adapter: axiosadapter;
    private _store: PnPClientStore;
    private _expiryMinutes: number;

    constructor() {
        this._adapter = new axiosadapter('graphql', 10000);
    }

    /**
     * Use caching for all requests
     * 
     * @param {boolean} bool Use caching
     * @param {number} expiryMinutes Expiry in minutes
     * @param {string} storeName Store name
     */
    public usingCaching(bool: boolean = true, expiryMinutes: number = 5, storeName: 'local' | 'session' = 'session') {
        this._store = bool && new PnPClientStorage()[storeName];
        this._expiryMinutes = expiryMinutes;
        return this;
    }

    public async query<T>(query: string, variables: TypedHash<any> = {}): Promise<T> {
        try {
            if (this._store) {
                await this._store.deleteExpired();
                const key = `${query}_${JSON.stringify(variables)}`;
                return this._store.getOrPut(key, async () => (await this._adapter.post(undefined, { query, variables })).data, dateAdd(new Date(), 'minute', this._expiryMinutes));
            } else {
                return (await this._adapter.post(undefined, { query, variables })).data;
            }
        } catch (error) {
            throw error.response.data.errors;
        }
    }
}