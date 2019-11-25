import axios, { AxiosInstance } from 'axios';
import * as moment from 'moment';
import { ICalEvent, IProject } from 'models';
require('moment/locale/en-gb');

export class DataAdapter {
    private _instance: AxiosInstance;

    constructor(base = 'api/') {
        this._instance = axios.create({
            baseURL: `${document.location.origin}/${base}`,
            timeout: 5000,
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

    /**
     * Get projects
     * 
     * @param {string} customerKey Customer key
     */
    public async getProjects(customerKey?: string): Promise<IProject[]> {
        if (customerKey) {
            return this.get(`projects/${customerKey}`);
        }
        return this.get('projects');
    }

    /**
     * Get all customers
     */
    public async getAllCustomers(): Promise<any[]> {
        return this.get('customers');
    }

    /**
     * Get events
     * 
     * @param {moment.Moment} startOfWeek Start of week
     */
    public async getEvents(startOfWeek: moment.Moment): Promise<ICalEvent[]> {
        return this.get(`events/${startOfWeek.toISOString()}`);
    }

    /**
     * Get approved entries for project
     * 
     * @param {string} projectKey Project key
     */
    public async getApprovedEntriesForProject(projectKey: string): Promise<ICalEvent[]> {
        return this.get(`approved/${projectKey}`);
    }

    /**
     * Get approved entries for project
     * 
     * @param {ICalEvent[]} events Events
     */
    public async approveEvents(events: ICalEvent[]): Promise<boolean> {
        return (await this.post('approve', events));
    }

    /**
     * Get
     * 
     * @param {string} url URL
     */
    public async get(url: string = ''): Promise<any> {
        return (await this._instance.get(url, { withCredentials: true })).data;
    }
}