import { ICustomer } from './customer.types'
import { ILabel } from './label.types'
import { IOutlookCategory } from './outlookCategory.types'

export interface IProject {
  id?: string
  key: string
  customerKey: string
  name: string
  description: string
  icon: string
  webLink?: string
  externalSystemURL?: string
  customer?: ICustomer
  outlookCategory?: IOutlookCategory
  inactive?: boolean
  labels?: ILabel[]
  createOutlookCategory?: boolean;
}

/**
 * Variables for query projects
 */
export interface IProjectsQueryVariables {
  customerKey: string;
  sortBy: string;
}

/**
 * Variables for mutation createOrUpdateCustomer
 */
export interface ICreateOrUpdateProjectVariables {
  project: IProject;
  update: boolean;
}