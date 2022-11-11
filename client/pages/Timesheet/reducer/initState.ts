import { DateRangeType } from '@fluentui/react'
import _ from 'underscore'
import { ITimesheetState, TimesheetPeriod, TimesheetScope, TimesheetView } from '../types'
import { ITimesheetReducerParameters } from './types'

/**
 * Initializes state based on url parameters
 *
 * @param parameters - Timesheet reducer parameters
 *
 * @returns Initial state
 */
export function initState(
  parameters: ITimesheetReducerParameters
): ITimesheetState {
  const periods = []
  const dateRangeType = parameters.url.dateRange ? Number.parseInt(parameters.url.dateRange) as DateRangeType : DateRangeType.Week
  const scope = _.isEmpty(Object.keys(parameters.url))
    ? new TimesheetScope(undefined, dateRangeType)
    : new TimesheetScope(undefined, dateRangeType).fromParams(parameters.url)
  if (dateRangeType === DateRangeType.Month) {
    periods.push(new TimesheetPeriod().useMock())
  }
  return {
    periods,
    scope,
    dateRangeType,
    selectedView:
      (parameters.url.view as TimesheetView) ?? TimesheetView.Overview,
    navHistory: []
  }
}
