
import gql from 'graphql-tag';
import { IProject } from 'models';

export interface IGetProjectsEntries {
    projects: IProject[];
}

export const GET_PROJECTS = gql`
    query($customerKey: String) {
        projects: getProjects(customerKey: $customerKey) {
            key,
            name,
            description,
            webLink,
            icon
        }
    }
`;