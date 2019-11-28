import { useQuery } from '@apollo/react-hooks';
import * as getValue from 'get-value';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import { GET_PROJECTS } from '../../Projects/GET_PROJECTS';
import { ProjectList } from '../../Projects/ProjectList';

export const CustomerDetails = ({ customer }) => {
    console.log(customer);
    const { loading, error, data } = useQuery(GET_PROJECTS, { variables: { customerKey: getValue(customer, 'key') } });

    const projects = getValue(data, 'projects', { default: [] });

    return (
        <div>
            <>
                <h3>{customer.name}</h3>
                <p hidden={!customer.description}>{customer.description}</p>
                <p hidden={!customer.webLink}><a href={customer.webLink}>{customer.webLink}</a></p>
            </>
            {error && <MessageBar messageBarType={MessageBarType.error}>An error occured.</MessageBar>}
            {!error && (
                <ProjectList
                    projects={projects}
                    enableShimmer={loading}
                    search={{ placeholder: `Search projects for ${customer.name}...` }}
                    renderLink={true}
                    height={300} />
            )}
        </div>
    );
};
