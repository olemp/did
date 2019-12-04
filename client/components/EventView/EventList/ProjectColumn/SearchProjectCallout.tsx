
import { useQuery } from '@apollo/react-hooks';
import AutosuggestHighlightMatch from 'autosuggest-highlight/match';
import AutosuggestHighlightParse from 'autosuggest-highlight/parse';
import { GET_PROJECTS } from 'components/Projects/GET_PROJECTS';
import { Callout } from 'office-ui-fabric-react/lib/Callout';
import * as React from 'react';
import { useState } from 'react';
import AutoSuggest from 'react-autosuggest';
import { IProject } from 'models';

/**
 * @component SearchProjectCallout
 * @description @todo
 */
export const SearchProjectCallout = ({ target, onSelected, onDismiss }) => {
    let [projects, setProjects] = useState<IProject[]>(null);
    let [suggestions, setSuggestions] = useState([]);
    let [value, setValue] = useState('');
    const { loading, data } = useQuery(GET_PROJECTS, { skip: !!projects, variables: { sortBy: 'name' }, fetchPolicy: 'cache-first', });

    React.useEffect(() => { (!loading && !!data) && setProjects(data.projects); }, [data, loading]);


    const getSuggestions = (value: string) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        return inputLength === 0 ? [] : projects.filter(p => (getSuggestionValue(p)).toLowerCase().slice(0, inputLength) === inputValue);
    };

    const getSuggestionValue = (project: IProject) => `${project.name} (${project.customerKey})`;

    const renderSuggestion = (project: IProject, { query }) => {
        const matches = AutosuggestHighlightMatch(getSuggestionValue(project), query);
        const parts = AutosuggestHighlightParse(getSuggestionValue(project), matches);
        return (
            <div style={{ padding: 4 }}>
                {parts.map((part, index) => {
                    const className = part.highlight ? 'react-autosuggest__suggestion-match' : null;
                    return (
                        <span className={className} key={index}>
                            {part.text}
                        </span>
                    );
                })}
            </div>
        );
    }
    
    return (
        <Callout
            className='c-searchproject-callout'
            hidden={!target}
            target={target}
            onDismiss={onDismiss}>
            {!!projects && (
                <AutoSuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={({ value }) => setSuggestions(getSuggestions(value))}
                    onSuggestionsClearRequested={() => setSuggestions([])}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    onSuggestionSelected={(_event, { suggestion }) => onSelected(suggestion)}
                    inputProps={{
                        placeholder: 'Search projects...',
                        value,
                        onChange: (_event: any, { newValue }) => setValue(newValue),
                        width: '100%',
                    }} />
            )}
        </Callout>
    );
}