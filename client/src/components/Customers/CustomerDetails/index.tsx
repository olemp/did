import * as React from 'react';
import { ICustomerDetailsProps } from './IProjectDetailsProps';
import { ProjectList } from '../../Projects/ProjectList';

export const CustomerDetails = ({ customer, projects }: ICustomerDetailsProps) => (
    <div>
        <h2>{customer.name}</h2>
        <p hidden={!customer.description}>{customer.description}</p>
        <p hidden={!customer.webLink}><a href={customer.webLink}>{customer.webLink}</a></p>
        <ProjectList
            projects={projects}
            search={{ placeholder: `Search projects for ${customer.name}...` }}
            renderLink={true}
            selection={null}
            height={300} />
    </div>
);