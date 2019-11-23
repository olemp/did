import axios, { AxiosInstance } from 'axios';
import * as moment from 'moment';
import { ICalEvent, IProject } from 'models';
require('moment/locale/en-gb');

export class DataAdapter {
    private _instance: AxiosInstance;

    constructor() {
        this._instance = axios.create({
            baseURL: `${document.location.origin}/api/`,
            timeout: 5000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
    }

    /**
     * Get projects
     * 
     * @param {string} customerKey Customer key
     */
    public async getProjects(customerKey?: string): Promise<IProject[]> {
        if (customerKey) {
            return (await this._instance.get(`projects/${customerKey}`, { withCredentials: true })).data;
        }
        return (await this._instance.get('projects', { withCredentials: true })).data;
    }

    /**
     * Get all customers
     */
    public async getAllCustomers(): Promise<any[]> {
        return (await this._instance.get('customers', { withCredentials: true })).data;
    }

    /**
     * Get events
     * 
     * @param {moment.Moment} startOfWeek Start of week
     */
    public async getEvents(startOfWeek: moment.Moment): Promise<ICalEvent[]> {
        return (await this._instance.get(`events/${startOfWeek.toISOString()}`, { withCredentials: true })).data;
    }

    /**
     * Get approved entries for project
     * 
     * @param {string} projectKey Project key
     */
    public async getApprovedEntriesForProject(projectKey: string): Promise<ICalEvent[]> {
        return (await this._instance.get(`approved/${projectKey}`, { withCredentials: true })).data;
    }

    /**
     * Get approved entries for project
     * 
     * @param {ICalEvent[]} events Events
     */
    public async approveEvents(events: ICalEvent[]): Promise<boolean> {
        return (await this._instance.post(`approve`, events, { withCredentials: true })).data;
    }
}