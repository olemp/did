import { Customer } from './customer.types'
import { LabelObject } from './label.types'

export interface IEvent {
  id: string
  key: string
  day: string
  title: string
  body: string
  isOrganizer: boolean
  startDateTime: string
  endDateTime: string
  date: string
  duration: number
  project: any
  customer: Customer
  projectKey: string
  customerKey: string
  suggestedProject: any
  webLink: string
  labels: LabelObject[]
  error: any
  manualMatch?: boolean
  isSystemIgnored?: boolean
}

export interface ITimesheetPeriod {
  /**
   * Identifier for the period week_month_year
   */
  id: string

  /**
   * Week number
   */
  week: number

  /**
   * Month string
   */
  month: string

  /**
   * Start date time ISO string
   */
  startDateTime: string

  /**
   * End date time ISO string
   */
  endDateTime: string

  /**
   * Period confirmed
   */
  isConfirmed: boolean

  /**
   * Events
   */
  events: IEvent[]

  /**
   * Is there an active forecast for the period
   */
  isForecasted: boolean

  /**
   * Is the period in the future
   */
  isForecast: boolean

  /**
   * Forecasted hours
   */
  forecastedHours: number
}

/**
 * Timesheet period data used when submitting/unsubmitting the period
 */
export interface ITimesheetPeriodData {
  /**
   * Identifier for the period week_month_year
   */
  id: string

  /**
   * Start date time ISO string
   */
  startDateTime: string

  /**
   * End date time ISO string
   */
  endDateTime: string

  /**
   * Matched events
   *
   * * {string} id
   * * {string} projectId
   * * {boolean} manualMatch
   */
  matchedEvents: ITimesheetPeriodMatchedEvent[]

  /**
   * Forecasted hours
   */
  forecastedHours: number

  /**
   * Hours
   */
  hours?: number
}

export interface ITimesheetPeriodMatchedEvent {
  id: string
  projectId: string
  manualMatch: boolean
}

/**
 * Variables for query timesheet
 */
export interface ITimesheetQueryVariables {
  startDateTime: string
  endDateTime: string
  dateFormat: string
  locale: string
}

/**
 * Variables for mutation submitPeriod
 */
export interface ISubmitPeriodVariables {
  period: ITimesheetPeriodData
  forecast: boolean
}

/**
 * Variables for mutation unsubmitPeriod
 */
export interface IUnsubmitPeriodVariables {
  period: ITimesheetPeriodData
  forecast: boolean
}
