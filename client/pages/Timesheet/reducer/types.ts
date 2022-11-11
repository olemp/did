import { TFunction } from 'i18next'
import { ITimesheetParameters, ITimesheetProps } from '../types'

export interface ITimesheetReducerParameters {
  /**
   * URL parameters
   */
  url: ITimesheetParameters

  /**
   * Translate function
   */
  t?: TFunction

  /**
   * Timesheet props
   */
  props: ITimesheetProps
}
