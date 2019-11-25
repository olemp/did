import axios, { AxiosInstance } from 'axios';

export default class AxiosAdapter {
    private _instance: AxiosInstance;

    constructor(base: string, timeout: number) {
        this._instance = axios.create({
            baseURL: `${document.location.origin}/${base}`,
            timeout,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
    }

    /**
     * Post
     * 
     * @param {string} url URL
     * @param {any} data Data
     */
    public async post(url: string = '', data: any): Promise<any> {
        return (await this._instance.post(url, data, { withCredentials: true })).data;
    }
}