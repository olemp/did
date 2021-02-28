/* eslint-disable tsdoc/syntax */
import { useQuery } from '@apollo/client'
import { useLayoutEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useParams } from 'react-router-dom'
import initFilters from '../filters'
import { getQueryPresets } from '../queries'
import { DATA_UPDATED, INIT } from '../reducer/actions'
import { IReportsParameters } from '../types'
import $timeentries from './timeentries.gql'
import { useReportsReducer } from './useReportsReducer'

/**
 * Hook for Reports
 *
 * * Get history using useHistory
 * * Get URL params using useParams
 * * Get queries using getQueries
 * * Using reducer from /reducer
 * * Using query with timeentries.gql
 * * Layout effect for updating URL when changing query
 * * Layout effects for initialiing state and updating state
 *   when the query is reloaded
 *
 * @category Reports Hooks
 */
export function useReports() {
  const { t } = useTranslation()
  const parameters = useParams<IReportsParameters>()
  const history = useHistory()
  const queries = getQueryPresets(t)
  const { state, dispatch } = useReportsReducer(queries)
  const query = useQuery($timeentries, {
    skip: !state.query,
    fetchPolicy: 'cache-first',
    variables: state.query?.variables
  })
  useLayoutEffect(() => dispatch(INIT()), [dispatch])
  useLayoutEffect(() => dispatch(DATA_UPDATED({ query })), [query, dispatch])
  useLayoutEffect(() => history.push(`/reports/${state.query?.key || ''}`), [
    state.query,
    history
  ])
  const filters = useMemo(() => initFilters(state.filter, t), [state.filter, t])
  return {
    state,
    dispatch,
    params: parameters,
    queries,
    history,
    filters,
    t
  }
}
