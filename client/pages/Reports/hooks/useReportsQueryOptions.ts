import { IChoiceGroupOption } from '@fluentui/react'
import { AnyAction } from '@reduxjs/toolkit'
import { CHANGE_QUERY } from '../reducer/actions'
import { IReportsState } from '../types'
import { useReportsQueries } from './useReportsQueries'

export type UseReportsQueryOptions = {
  queries: ReturnType<typeof useReportsQueries>
  state: IReportsState
  dispatch: React.Dispatch<AnyAction>
}
/**
 * Returns queries from `useReportsQueries` as choice group options
 * to be used in `<ChoiceGroup />` component. Also appends promoted
 * report links.
 *
 * @category Reports
 */
export function useReportsQueryOptions({
  queries,
  state,
  dispatch
}: UseReportsQueryOptions): IChoiceGroupOption[] {
  const promotedReportLinks = state.reportLinks?.filter((l) => l.promoted) ?? []
  const styles = {
    root: {
      padding: 25,
      maxWidth: 180
    },
    labelWrapper: {
      maxWidth: 'none'
    },
    field: {
      border: 'none',
      ':before': {
        display: 'none'
      }
    }
  }
  return [
    ...queries.map<IChoiceGroupOption>(
      ({ itemKey, headerText, itemIcon }) =>
      ({
        key: itemKey,
        text: headerText,
        iconProps: { iconName: itemIcon },
        onClick: () => dispatch(CHANGE_QUERY({ itemKey })),
        styles
      })
    ),
    ...promotedReportLinks.map<IChoiceGroupOption>(
      (link) =>
      ({
        key: link.name,
        text: link.name,
        iconProps: { iconName: 'ExcelDocument', styles: { root: { color: 'green' } } },
        onClick: () => window.open(link.externalUrl, '_blank'),
        styles
      })
    )
  ]
}
