import { ApolloQueryResult } from 'apollo-client'
import { createContext } from 'react'
import { Project } from 'types'


export interface IProjectsContext {
    outlookCategories: any[];
    projects: any[];
    setSelected: React.Dispatch<React.SetStateAction<Project>>;
    refetch(variables?: any): Promise<ApolloQueryResult<any>>;
}

export const ProjectsContext = createContext<IProjectsContext>(null)
