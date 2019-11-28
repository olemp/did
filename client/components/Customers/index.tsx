
import { useQuery } from '@apollo/react-hooks';
import * as getValue from 'get-value';
import { Selection } from 'office-ui-fabric-react/lib/DetailsList';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import { useState } from 'react';
import { CustomerDetails } from './CustomerDetails';
import { CustomerList } from './CustomerList';
import { GET_CUSTOMERS } from './GET_CUSTOMERS';

export const Customers = () => {
    let selection: Selection;
    const [selected, setSelected] = useState(null);
    const { loading, error, data } = useQuery(GET_CUSTOMERS);

    const onSelectionChanged = () => {
        setSelected(selection.getSelection()[0]);
    }

    selection = new Selection({ onSelectionChanged });

    return (
        <div>
            {error && <MessageBar messageBarType={MessageBarType.error}>An error occured.</MessageBar>}
            {!error && (
                <CustomerList
                    enableShimmer={loading}
                    customers={getValue(data, 'customers', { default: [] })}
                    selection={selection}
                    height={300} />
            )}
            {selected && <CustomerDetails customer={selected} />}
        </div>
    );
}