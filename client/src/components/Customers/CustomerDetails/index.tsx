import * as React from 'react';
import { ICustomerDetailsProps } from './IProjectDetailsProps';
import { ProjectList } from '../../Projects/ProjectList';

export const CustomerDetails = ({ customer, projects }: ICustomerDetailsProps) => (
    <div>
        <h2>{customer.name}</h2>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis volutpat placerat aliquam. Quisque porta elit id condimentum sagittis. Integer massa justo, imperdiet et nibh non, ultrices porta est. Quisque id ipsum metus.
        </p>
        <ProjectList
            projects={projects}
            selection={null}
            height={300} />
    </div>
);