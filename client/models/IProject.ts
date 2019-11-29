import { IObjectWithKey } from 'office-ui-fabric-react/lib/DetailsList';

export interface IProject extends IObjectWithKey {
    id: string;
    customerKey: string;
    projectKey: string;
    name: string;
    description: string;
    webLink: string;
    icon: string;
}