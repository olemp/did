import _ from 'underscore'
import { ITimesheetState, TimesheetScope, TimesheetView } from '../types'
import { ITimesheetReducerParameters } from './types'

/**
 * Initializes state based on url parameters
 *
 * @param params - Timesheet reducer parameters
 *
 * @returns Initial state
 */

export function initState(
  parameters: ITimesheetReducerParameters
): ITimesheetState {
  return {
    periods: [],
    scope: _.isEmpty(Object.keys(parameters.url))
      ? new TimesheetScope()
      : new TimesheetScope().fromParams(parameters.url),
    dateRangeType: parameters.props.dateRangeType,
    selectedView:
      (parameters.url.view as TimesheetView) ?? TimesheetView.Overview,
    navHistory: []
  }
}
