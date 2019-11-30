
import { useQuery } from '@apollo/react-hooks';
import { List, IColumn, SelectionMode } from 'components/List';
import * as getValue from 'get-value';
import { ICustomer } from 'models';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import { useState } from 'react';
import { generateColumn as col } from 'utils/generateColumn';
import { getHash } from 'utils/getHash';
import { CustomerDetails } from './CustomerDetails';
import { GET_CUSTOMERS } from './GET_CUSTOMERS';

export const Customers = () => {
    const [selected, setSelected] = useState<ICustomer>(null);
    const { loading, error, data } = useQuery(GET_CUSTOMERS, { fetchPolicy: 'cache-first' });

    const columns: IColumn[] = [
        col('customerKey', 'Key', { maxWidth: 100 }),
        col('name', 'Name'),
    ];

    let customers: ICustomer[] = getValue(data, 'customers', { default: [] });

    if (getHash()) {
        let [_selected] = customers.filter(c => c.key === getHash());
        if (_selected && !selected) {
            setSelected(_selected);
        }
    }

    return (
        <div>
            {error && <MessageBar messageBarType={MessageBarType.error}>An error occured.</MessageBar>}
            {!error && (
                <List
                    enableShimmer={loading}
                    items={customers}
                    columns={columns}
                    searchBox={{ placeholder: 'Search in customers...' }}
                    selection={{ mode: SelectionMode.single, onChanged: selected => setSelected(selected) }}
                    height={350} />
            )}
            {selected && <CustomerDetails customer={selected} />}
        </div>
    );
}