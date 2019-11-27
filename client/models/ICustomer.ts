import { IObjectWithKey } from 'office-ui-fabric-react/lib/DetailsList';

export interface ICustomer extends IObjectWithKey {
    customerKey: string;
    name: string;
    description: string;
    webLink: string;
}