import axios, { AxiosInstance } from 'axios';
import { setupCache } from 'axios-cache-adapter';

const AxiosAdapterDefaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

export default class AxiosAdapter {
    private _instance: AxiosInstance;

    constructor(base: string, timeout: number, headers = AxiosAdapterDefaultHeaders) {
        this._instance = axios.create({
            baseURL: `${document.location.origin}/${base}`,
            timeout,
            headers,
            adapter: setupCache({ maxAge: 15 * 60 * 1000 }).adapter,
        });
    }

    /**
     * Post
     * 
     * @param {string} url URL
     * @param {any} data Data
     */
    public async post(url: string = '', data: any): Promise<any> {
        const response = await this._instance.post(url, data, { withCredentials: true });
        return response.data;
    }
}