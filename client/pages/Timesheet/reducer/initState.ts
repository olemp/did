import { DateRangeType } from '@fluentui/react'
import _ from 'underscore'
import { ITimesheetParameters, ITimesheetState, TimesheetScope } from '../types'

/**
 * Initializes state based on url parameters
 *
 * @param url - Url parameters
 * @returns Initial state
 */

export function initState(url: ITimesheetParameters): ITimesheetState {
  return {
    periods: [],
    scope: _.isEmpty(Object.keys(url))
      ? new TimesheetScope()
      : new TimesheetScope().fromParams(url),
    dateRangeType: DateRangeType.Week,
    selectedView: url.view || 'overview',
    navHistory: []
  }
}
