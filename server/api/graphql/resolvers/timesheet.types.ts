import { ICustomer } from './customer.types'
import { ILabel } from './label.types'

export interface IEvent {
  id: string
  title: string
  body: string
  isOrganizer: boolean
  startDateTime: string
  endDateTime: string
  date: string
  duration: number
  project: any
  customer: ICustomer
  projectKey: string
  customerKey: string
  suggestedProject: any
  webLink: string
  labels: ILabel[]
  isSystemIgnored: boolean
  error: any
}

/**
 * Variables for query timesheet
 */
export interface ITimesheetQueryVariables {
  startDateTime: string;
  endDateTime: string;
  dateFormat: string;
  locale: string;
}

/**
 * Variables for mutation submitPeriod
 */
export interface ISubmitPeriodVariables {
 period: any;
 forecast: boolean;
}

/**
 * Variables for mutation unsubmitPeriod
 */
export interface IUnsubmitPeriodVariables {
  period: any;
  forecast: boolean;
}