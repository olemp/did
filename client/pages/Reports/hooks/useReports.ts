/* eslint-disable tsdoc/syntax */
import { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { useUpdateUserConfiguration } from '../../../hooks/user/useUpdateUserConfiguration'
import { useReportsReducer } from '../reducer'
import { useColumns } from './useColumns'
import { useFilters } from './useFilters'
import { useQueries } from './useQueries'
import { useReportsQuery } from './useReportsQuery'

/**
 * Hook for Reports
 *
 * * Get history using `useHistory`
 * * Get URL params using `useParams`
 * * Get queries using `useQueries`
 * * Using reducer `useReportsReducer`
 * * Using `useReportQuery`
 * * Layout effect (`useLayoutEffect`) for updating URL when changing query
 *   when the query is reloaded
 *
 * @category Reports Hooks
 */
export function useReports() {
  const { t } = useTranslation()
  const history = useHistory()
  const queries = useQueries()
  const [state, dispatch] = useReportsReducer(queries)
  useReportsQuery({ state, dispatch })
  useLayoutEffect(() => {
    if (state.preset) {
      history.push(`/reports/${state.preset?.key || ''}`)
    }
  }, [state.preset, history])

  const columns = useColumns({ defaults: { isResizable: true } })
  const filters = useFilters({ filter: state.filter })

  useUpdateUserConfiguration(
    {
      'reports.filters': state.savedFilters
    },
    !state.loading && !!state.filter?.text
  )

  return {
    state,
    dispatch,
    queries,
    history,
    columns,
    filters,
    t
  }
}

export { useQueries }
