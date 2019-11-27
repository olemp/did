
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Selection } from 'office-ui-fabric-react/lib/DetailsList';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import * as React from 'react';
import { CustomerList } from './CustomerList';
import { CustomerDetails } from './CustomerDetails';

const GET_CUSTOMERS = gql`
{
    customers {
        key,
        customerKey,
        name,
        description,
        webLink
    }
}`;

export const Customers = () => {
    let selection: Selection;
    const [selected, setSelected] = React.useState(null);
    const { loading, error, data } = useQuery(GET_CUSTOMERS);

    const onSelectionChanged = () => {
        setSelected(selection.getSelection()[0]);
    }

    selection = new Selection({ onSelectionChanged });

    if (loading) {
        return <Spinner label='Loading customers....' />;
    }
    if (error) {
        return <MessageBar messageBarType={MessageBarType.error}>An error occured.</MessageBar>;
    }
    return (
        <div>
            <CustomerList
                customers={data.customers}
                selection={selection}
                height={300} />
            <CustomerDetails customer={selected} />
        </div>
    );
}