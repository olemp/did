import { Selection } from 'office-ui-fabric-react/lib/DetailsList';
import { ICustomer } from '../../../models';

export interface ICustomerListProps {
    customers: ICustomer[];
    height: number;
    selection?: Selection;
    enableShimmer?: boolean;
}
