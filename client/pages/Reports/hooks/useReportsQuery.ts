/* eslint-disable react-hooks/exhaustive-deps */
import { FetchPolicy, useLazyQuery, useQuery } from '@apollo/client'
import { useLayoutEffect } from 'react'
import { DATA_UPDATED } from '../reducer/actions'
import { default_query, report_links } from './useReportsQueries'

/**
 * Hook for Reports Query.
 *
 * Using `useLazyQuery` and `useLayoutEffect` and dispatches
 * `DATA_UPDATED` action on query changes. Also fetches report links
 * using `useQuery`.
 *
 * @param param0 - State and dispatch
 * @param fetchPolicy - Fetch policy (defaults to `no-cache`)
 *
 * @category Reports Hooks
 */
export function useReportsQuery(
  { state, dispatch },
  fetchPolicy: FetchPolicy = 'no-cache'
) {
  const [query, result] = useLazyQuery(state.preset?.query || default_query, {
    fetchPolicy,
    variables: state.preset?.variables || {},
  })
  const reportLinksQuery = useQuery(report_links, { fetchPolicy: 'cache-first' })
  useLayoutEffect(() => dispatch(DATA_UPDATED({ result, reportLinksQuery })), [result.loading, reportLinksQuery.loading])
  return query
}
