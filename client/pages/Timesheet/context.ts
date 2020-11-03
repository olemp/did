import { ApolloQueryResult } from  '@apollo/react-hooks'
import { TFunction } from 'i18next'
import { createContext } from 'react'
import { TimesheetAction } from './reducer'
import { ITimesheetState } from './types'

export interface ITimesheetContext extends ITimesheetState {
  /**
   * On submit period
   *
   * Action depends on parameter forecast
   *
   * - If set to true: Forecast the period
   *
   * - If set to false: Confirms the period
   *
   * @param {boolean} forecast Forecast
   */
  onSubmitPeriod: (forecast: boolean) => void

  /**
   * On unsubmit period
   *
   * Action depends on parameter forecast
   *
   * - If set to true: Removes forecast for period
   *
   * - If set to false: Unconfirms the period
   *
   * @param {boolean} forecast Forecast
   */
  onUnsubmitPeriod: (forecast: boolean) => void

  /**
   * Dispatch an action
   */
  dispatch?: React.Dispatch<TimesheetAction>

  /**
   * Refetch data
   */
  refetch?: () => Promise<ApolloQueryResult<any>>

  /**
   * Translate function
   */
  t: TFunction
}

export const TimesheetContext = createContext<ITimesheetContext>(null)
