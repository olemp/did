import { ICustomer } from './'
import { IProject } from './IProject'
import { ILabel } from './'

export interface ITimeEntry {
  id: string
  key: string
  title: string
  isOrganizer: boolean
  project: IProject
  suggestedProject: IProject
  customer: ICustomer
  projectKey: string
  customerKey: string
  webLink: string
  duration: number
  startDateTime: string
  endDateTime: string
  day: string
  manualMatch?: boolean
  isSystemIgnored?: boolean
  error?: { code: string }
  labels?: ILabel[]
}
