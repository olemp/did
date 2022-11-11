import { DateRangeType } from '@fluentui/react'
import { IProgressProps } from 'components/Progress/types'
import { TimesheetPeriod } from './TimesheetPeriod'
import { TimesheetScope } from './TimesheetScope'

/**
 * @category Timesheet
 */
export enum TimesheetView {
  Overview = 'overview',
  Summary = 'summary',
  Allocation = 'allocation'
}

/**
 * @category Timesheet
 */
export interface ITimesheetState {
  /**
   * Periods for the seleted scope
   */
  periods: TimesheetPeriod[]

  /**
   * The currently selected period
   */
  selectedPeriod?: TimesheetPeriod

  /**
   * The currently seelcted view
   */
  selectedView: TimesheetView

  /**
   * The current scope
   */
  scope: TimesheetScope

  /**
   * The current date range type
   */
  dateRangeType: DateRangeType

  /**
   * Loading props
   */
  loading?: IProgressProps

  /**
   * Error
   */
  error?: any

  /**
   * Show hotkeys modal
   */
  showHotkeysModal?: boolean

  /**
   * Navigation history
   */
  navHistory?: string[]
}

/**
 * @category Timesheet
 */
 export interface ITimesheetProps {
  /**
   * Date range type
   */
  dateRangeType?: DateRangeType
}

/**
 * @category Timesheet
 */
export interface ITimesheetParameters {
  view: string
  week: string
  month: string
  year: string
}

export * from './context'
export * from './TimesheetPeriod'
export * from './TimesheetScope'
