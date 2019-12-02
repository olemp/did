
import { useQuery } from '@apollo/react-hooks';
import { GET_PROJECTS } from 'components/Projects/GET_PROJECTS';
import { Callout } from 'office-ui-fabric-react/lib/Callout';
import * as React from 'react';
import { useState } from 'react';
import * as AutoComplete from 'react-autocomplete';

/**
 * @component SearchProjectCallout
 * @description @todo
 */
export const SearchProjectCallout = ({ target, onSelected, onDismiss }) => {
    let [projects, setProjects] = useState(null);
    let [value, setValue] = useState('');
    const { loading, data } = useQuery(GET_PROJECTS, { skip: !!projects, variables: { sortBy: 'name' }, fetchPolicy: 'cache-first', });

    React.useEffect(() => { (!loading && !!data) && setProjects(data.projects); }, [data, loading]);

    return (
        <Callout
            style={{ width: 190 }}
            className='c-searchproject-callout'
            hidden={!target}
            target={target}
            onDismiss={onDismiss}>
            <h5>Search projects</h5>
            {!!projects && (
                <AutoComplete
                    getItemValue={item => item.name}
                    shouldItemRender={item => item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 && value.length > 2}
                    items={projects}
                    renderItem={(item, isHighlighted) =>
                        <div key={item.key} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                            {item.name}
                        </div>
                    }
                    renderMenu={(items, _value, style) => <div className="autocomplete-dropdown-menu" style={style} children={items} />}
                    value={value}
                    onChange={(_event, value) => setValue(value)}
                    onSelect={(_val, item) => onSelected(item)} />
            )}
        </Callout>
    );
}