import { ICustomer, IOutlookCategory } from '.'
import { ILabel } from './'

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
}
