
import gql from 'graphql-tag';
import { IProject } from 'models';

export interface IGetProjectsEntries {
    projects: IProject[];
}

export const GET_PROJECTS = gql`
    query($customerKey: String, $sortBy: String) {
        projects: getProjects(customerKey: $customerKey, sortBy: $sortBy) {
            key,
            name,
            description,
            webLink,
            icon
        }
    }
`;