import { IObjectWithKey } from 'office-ui-fabric-react/lib/DetailsList';

export interface ICustomer extends IObjectWithKey {
    name: string;
    description: string;
    webLink: string;
}