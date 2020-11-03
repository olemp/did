import { Customer } from './customer.types'
import { LabelObject } from './label.types'

export interface ITimeEntry {
  id: string
  key: string
  title: string
  isOrganizer: boolean
  project: any
  suggestedProject: any
  customer: Customer
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
  labels?: LabelObject[]
}

/**
 * Variables for query timeentries
 *
 * NB: The variables used must also be present in the query
 */
export interface ITimeEntriesQueryVariables {
  startDateTime?: string
  endDateTime?: string
  projectId?: string
  resourceId?: string
  weekNumber?: number
  monthNumber?: number
  startMonthIndex?: number
  endMonthIndex?: number
  year?: number
  currentUser?: boolean
  forecast?: boolean
  sortAsc?: boolean
}
