import _ from 'underscore'
import { ITimesheetState, TimesheetScope } from '../types'
import { ITimesheetReducerParameters } from './types'

/**
 * Initializes state based on url parameters
 *
 * @param params - Timesheet reducer parameters
 * 
 * @returns Initial state
 */

export function initState(params: ITimesheetReducerParameters): ITimesheetState {
  return {
    periods: [],
    scope: _.isEmpty(Object.keys(params.url))
      ? new TimesheetScope()
      : new TimesheetScope().fromParams(params.url),
    dateRangeType: params.props.dateRangeType,
    selectedView: params.url.view || 'overview',
    navHistory: []
  }
}
