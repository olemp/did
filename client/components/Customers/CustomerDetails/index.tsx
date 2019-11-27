import { useQuery } from '@apollo/react-hooks';
import * as getValue from 'get-value';
import gql from 'graphql-tag';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import { ProjectList } from '../../Projects/ProjectList';
import { ICustomer } from '../../../models';

const GET_PROJECTS = gql`
    query($customerKey: String!) {
        customerProjects(customerKey: $customerKey) {
            key,
            customerKey,
            name
        }
    }
`;

export interface ICustomerDetails {
    customer: ICustomer;
}

export const CustomerDetails = ({ customer }) => {
    if (!customer) return null;

    const { loading, error, data } = useQuery(GET_PROJECTS, { variables: { customerKey: customer.key } });

    const projects = getValue(data, 'customerProjects', { default: [] });

    return (
        <div>
            <h3>{customer.name}</h3>
            <p hidden={!customer.description}>{customer.description}</p>
            <p hidden={!customer.webLink}><a href={customer.webLink}>{customer.webLink}</a></p>
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
