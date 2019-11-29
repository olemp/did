
import { useQuery } from '@apollo/react-hooks';
import * as getValue from 'get-value';
import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import { useState } from 'react';
import { generateColumn as col } from 'utils/generateColumn';
import { List } from 'components/List';
import { CustomerDetails } from './CustomerDetails';
import { GET_CUSTOMERS } from './GET_CUSTOMERS';

export const Customers = () => {
    const [selected, setSelected] = useState(null);
    const { loading, error, data } = useQuery(GET_CUSTOMERS);

    const columns: IColumn[] = [
        col('customerKey', 'Key'),
        col('name', 'Name'),
    ];

    return (
        <div>
            {error && <MessageBar messageBarType={MessageBarType.error}>An error occured.</MessageBar>}
            {!error && (
                <List
                    enableShimmer={loading}
                    items={getValue(data, 'customers', { default: [] })}
                    columns={columns}
                    searchBox={{ placeholder: 'Search in customers...' }}
                    onSelectionChanged={selected => setSelected(selected)}
                    height={300} />
            )}
            {selected && <CustomerDetails customer={selected} />}
        </div>
    );
}