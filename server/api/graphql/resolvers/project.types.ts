import { Customer } from './customer.types'
import { LabelObject } from './label.types'
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
  customer?: Customer
  outlookCategory?: IOutlookCategory
  inactive?: boolean
  labels?: LabelObject[]
  createOutlookCategory?: boolean
}

/**
 * Variables for query projects
 */
export interface IProjectsQueryVariables {
  customerKey: string
  sortBy: string
}

/**
 * Variables for mutation createOrUpdateProject
 */
export interface ICreateOrUpdateProjectVariables {
  project: IProject
  update: boolean
}