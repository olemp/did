/* eslint-disable react-hooks/exhaustive-deps */
import { DateRangeType } from '@fluentui/react'
import { useAppContext } from 'AppContext'
import { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import s from 'underscore.string'
import { UPDATE_BREADCRUMB } from '../../../app/reducer'
import { ITimesheetState } from '../types'

/**
 * Updates history using `useHistory` based on
 * state changes.
 *
 * @category Timesheet Hooks
 */
export function useTimesheetHistory(state: ITimesheetState) {
  const { t } = useTranslation()
  const history = useHistory()
  const { dispatch } = useAppContext()

  /**
   * Dispatches action `UPDATE_BREADCRUMB`
   */
  const onUpdateBreadcrumb = (text: string, level: number) =>
    dispatch(
      UPDATE_BREADCRUMB({
        key: text,
        text,
        level
      })
    )

  useLayoutEffect(() => {
    if (!state.selectedPeriod) return
    history.push(
      ['/timesheet', state.dateRangeType.toString(), state.selectedView, state.selectedPeriod.path].join('/')
    )
    if (state.selectedPeriod) {
      const isSplitWeek = (state.periods.length === 2) && state.dateRangeType === DateRangeType.Week
      if (isSplitWeek) {
        onUpdateBreadcrumb(s.capitalize(state.selectedPeriod.month), 3)
        onUpdateBreadcrumb(state.selectedPeriod.getName(t), 4)
      } else {
        onUpdateBreadcrumb(state.selectedPeriod.getName(t), 3)
      }
    }
  }, [state.selectedView, state.selectedPeriod, state.dateRangeType])
}
