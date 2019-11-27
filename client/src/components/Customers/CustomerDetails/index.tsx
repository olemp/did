import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import * as React from 'react';
import { ProjectList } from '../../Projects/ProjectList';

const GET_PROJECTS = gql`
    query($customerKey: String!) {
        customerProjects(customerKey: $customerKey) {
            key,
            customerKey,
            name
        }
    }
`;

export const CustomerDetails = ({ customer }) => {
    if (!customer) return null;
    const { loading, error, data } = useQuery(GET_PROJECTS, { variables: { customerKey: customer.key } });
    if (loading) {
        return <Spinner label='Loading...' />;
    }
    if (error) {
        return <MessageBar messageBarType={MessageBarType.error}>An error occured.</MessageBar>;
    }
    return (
        <div>
            <h2>{customer.name}</h2>
            <p hidden={!customer.description}>{customer.description}</p>
            <p hidden={!customer.webLink}><a href={customer.webLink}>{customer.webLink}</a></p>
            <ProjectList
                projects={data.customerProjects}
                search={{ placeholder: `Search projects for ${customer.name}...` }}
                renderLink={true}
                height={300} />
        </div>
    );
};