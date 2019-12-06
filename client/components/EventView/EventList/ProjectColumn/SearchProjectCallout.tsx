
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
        if (inputValue.length === 0) return [];
        return projects.filter(project => {
            let searchString = [project.name, project.customer.name].join(' ').toLowerCase();
            return searchString.indexOf(inputValue) !== -1;
        });
    };

    const getSuggestionValue = (project: IProject) => project.name;

    const renderSuggestion = (project: IProject, { query }) => {
        return (
            <div style={{ marginLeft: 4, padding: 4 }}>
                <div>
                    {AutosuggestHighlightParse(project.name, AutosuggestHighlightMatch(project.name, query)).map((part, index) => {
                        const className = part.highlight ? 'react-autosuggest__suggestion-match' : null;
                        return (
                            <span className={className} key={index}>
                                {part.text}
                            </span>
                        );
                    })}
                </div>
                <div style={{ fontSize: '7pt' }}>
                    <span>for </span>
                    {AutosuggestHighlightParse(project.customer.name, AutosuggestHighlightMatch(project.customer.name, query)).map((part, index) => {
                        const className = part.highlight ? 'react-autosuggest__suggestion-match' : null;
                        return (
                            <span className={className} key={index}>
                                {part.text}
                            </span>
                        );
                    })}
                </div>
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