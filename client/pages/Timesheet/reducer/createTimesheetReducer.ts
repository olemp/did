import { createReducer, current } from '@reduxjs/toolkit'
import { TimesheetPeriodObject } from 'types'
import _ from 'underscore'
import { ITimesheetState, TimesheetPeriod, TimesheetScope } from '../types'
import {
  CHANGE_PERIOD,
  CHANGE_DATE_RANGE_TYPE,
  CHANGE_VIEW,
  CLEAR_IGNORES,
  CLEAR_MANUAL_MATCH,
  DATA_UPDATED,
  IGNORE_EVENT,
  MANUAL_MATCH,
  NEXT_PERIOD,
  PREVIOUS_PERIOD,
  SET_SCOPE,
  SUBMITTING_PERIOD,
  TOGGLE_SHORTCUTS,
  UNSUBMITTING_PERIOD
} from './actions'
import { initState } from './initState'
import { ITimesheetReducerParameters } from './types'

/**
 * Creating reducer for `<Timesheet />` using `reduxjs/toolkit`
 *
 * @param params - Timesheet reducer parameters
 */
export function createTimesheetReducer(params: ITimesheetReducerParameters) {
  return createReducer<ITimesheetState>(initState(params), (builder) =>
    builder
      .addCase(DATA_UPDATED, (state, { payload }) => {
        state.loading = payload.query.loading
          ? {
            label: params.t('timesheet.loadingTimesheetLabel'),
            description: params.t('timesheet.loadingTimesheetDescription'),
            iconProps: { iconName: 'RecurringEvent' }
          }
          : null
        if (payload.query.data) {
          const urlPeriodId = [params.url.week, params.url.month, params.url.year].join('_')
          const selectedPeriodId = state.selectedPeriod?.id || urlPeriodId
          state.periods = payload.query.data.periods.map(
            (period: TimesheetPeriodObject) =>
              new TimesheetPeriod().initialize(period)
          )
          const lastNav = _.last(state.navHistory)
          state.selectedPeriod =
            _.find(state.periods, (p) => p.id === selectedPeriodId) ||
            (lastNav === 'PREVIOUS_PERIOD'
              ? _.last(state.periods)
              : _.first(state.periods))
        }
        state.error = payload.query.error
      })
      .addCase(SET_SCOPE, (state, { payload }) => {
        state.scope =
          typeof payload === 'string' ? state.scope.set(payload) : payload
      })
      .addCase(SUBMITTING_PERIOD, (state, { payload }) => {
        state.loading = payload.forecast
          ? {
            label: params.t('timesheet.forecastingPeriodLabel'),
            description: params.t('timesheet.forecastingPeriodDescription'),
            iconProps: { iconName: 'PlanView' }
          }
          : {
            label: params.t('timesheet.confirmingPeriodLabel'),
            description: params.t('timesheet.confirmingPeriodDescription'),
            iconProps: { iconName: 'CheckMark' }
          }
      })
      .addCase(UNSUBMITTING_PERIOD, (state, { payload }) => {
        state.loading = payload.forecast
          ? {
            label: params.t('timesheet.unforecastingPeriodLabel'),
            description: params.t('timesheet.unforecastingPeriodDescription'),
            iconProps: { iconName: 'ClearFormattingEraser' }
          }
          : {
            label: params.t('timesheet.unconfirmingPeriodLabel'),
            description: params.t('timesheet.unconfirmingPeriodDescription'),
            iconProps: { iconName: 'SkypeCircleArrow' }
          }
      })
      .addCase(CHANGE_PERIOD, (state, { payload }) => {
        state.selectedPeriod = _.find(
          state.periods,
          (p: TimesheetPeriod) => p.id === payload.id
        )
      })
      .addCase(PREVIOUS_PERIOD, (state) => {
        state.navHistory.push(PREVIOUS_PERIOD.type)
        const { periods, selectedPeriod } = current(state)
        const index = periods.indexOf(selectedPeriod)
        if (state.periods.length === 1 || index === 0) {
          state.scope = state.scope.set('-1w')
        } else {
          state.selectedPeriod = _.find(
            periods,
            (p: TimesheetPeriod) => p.id !== selectedPeriod.id
          )
        }
      })
      .addCase(NEXT_PERIOD, (state) => {
        state.navHistory.push(NEXT_PERIOD.type)
        const { periods, selectedPeriod } = current(state)
        const index = periods.indexOf(selectedPeriod)
        if (state.periods.length === 1 || index === 1) {
          state.scope = state.scope.set('1w')
        } else {
          state.selectedPeriod = _.find(
            periods,
            (p: TimesheetPeriod) => p.id !== selectedPeriod.id
          )
        }
      })
      .addCase(CHANGE_VIEW, (state, { payload }) => {
        console.log(payload.view)
        state.selectedView = payload.view
      })
      .addCase(CHANGE_DATE_RANGE_TYPE, (state, { payload }) => {
        state.dateRangeType = payload.dateRangeType
        state.scope = new TimesheetScope(state.scope.startDate.jsDate, payload.dateRangeType)
        state.periods = []
      })
      .addCase(MANUAL_MATCH, (state, { payload }) => {
        const { eventId, project } = payload
        state.selectedPeriod.setManualMatch(eventId, project)
        state.periods = state.periods.map((p) =>
          p.id === state.selectedPeriod.id ? state.selectedPeriod : p
        )
      })
      .addCase(CLEAR_MANUAL_MATCH, (state, { payload }) => {
        state.selectedPeriod.clearManualMatch(payload.id)
        state.periods = state.periods.map((p) =>
          p.id === state.selectedPeriod.id ? state.selectedPeriod : p
        )
      })
      .addCase(IGNORE_EVENT, (state, { payload }) => {
        state.selectedPeriod.ignoreEvent(payload.id)
        state.periods = state.periods.map((p) =>
          p.id === state.selectedPeriod.id ? state.selectedPeriod : p
        )
      })
      .addCase(CLEAR_IGNORES, (state) => {
        state.selectedPeriod.clearIgnoredEvents()
        state.periods = state.periods.map((p) =>
          p.id === state.selectedPeriod.id ? state.selectedPeriod : p
        )
      })
      .addCase(TOGGLE_SHORTCUTS, (state) => {
        state.showHotkeysModal = !state.showHotkeysModal
      })
  )
}
