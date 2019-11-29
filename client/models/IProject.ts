import { IObjectWithKey } from 'office-ui-fabric-react/lib/DetailsList';

export interface IProject extends IObjectWithKey {
    name: string;
    description: string;
    webLink: string;
    icon: string;
}