import { createAction, createReducer, current } from '@reduxjs/toolkit'
import { IFilter } from 'components/FilterPanel'
import get from 'get-value'
import { useMemo, useReducer } from 'react'
import _ from 'underscore'
import { searchObject } from 'utils'
import {
  ColumnHeaderContextMenu,
  IListColumn,
  IListProps,
  IListState,
  SortOptions
} from './types'

export const PROPS_UPDATED = createAction<IListProps>('PROPS_UPDATED')
export const EXECUTE_SEARCH = createAction<{ searchTerm: string }>(
  'EXECUTE_SEARCH'
)
export const INIT_COLUMN_HEADER_CONTEXT_MENU =
  createAction<ColumnHeaderContextMenu>('INIT_COLUMN_HEADER_CONTEXT_MENU')
export const DISMISS_COLUMN_HEADER_CONTEXT_MENU = createAction(
  'DISMISS_COLUMN_HEADER_CONTEXT_MENU'
)
export const SET_GROUP_BY = createAction<{ column: IListColumn }>(
  'SET_GROUP_BY'
)
export const SET_FILTER_BY = createAction<{ column: IListColumn }>(
  'SET_FILTER_BY'
)
export const SET_SORT = createAction<{
  column: IListColumn
  direction: 'asc' | 'desc'
}>('SET_SORT')
export const TOGGLE_FILTER_PANEL = createAction('TOGGLE_FILTER_PANEL')
export const TOGGLE_VIEW_COLUMNS_PANEL = createAction(
  'TOGGLE_VIEW_COLUMNS_PANEL'
)
export const FILTERS_UPDATED = createAction<{ filters: IFilter[] }>(
  'FILTERS_UPDATED'
)
export const UPDATE_COLUMNS = createAction<IListColumn[]>('UPDATE_COLUMNS')

/**
 * Applies filters to an array of items based on the provided filter values.
 * Also supports negation by prefixing the key with '!'.
 *
 * @param items The array of items to filter.
 * @param filterValues The filter values to apply.
 */
function applyFilters<T = any>(
  items: T[],
  filterValues: IListState['filterValues'] = {}
) {
  return items.filter(
    (item) =>
      _.filter(Object.keys(filterValues), (key) => {
        const filterValue = filterValues[key]
        const isNeg = key.startsWith('!')
        key = isNeg ? key.slice(1) : key
        const value = get(item as any, key, '')
        switch (typeof filterValue) {
          case 'boolean': {
            return isNeg ? value !== filterValue : value === filterValue
          }
          default: {
            return filterValue?.includes(value)
          }
        }
      }).length === Object.keys(filterValues).length
  )
}

/**
 * Reducer for Timesheet
 *
 * @param initialState - Initial state
 */
export default (initialState: IListState) => {
  const reducer = useMemo(() => {
    return createReducer(initialState, (builder) =>
      builder
        .addCase(PROPS_UPDATED, (state, { payload }) => {
          state.origItems = payload.items ?? []
          state.itemsPreFilter = current(state).origItems.filter((item) =>
            searchObject({
              item,
              searchTerm: state.searchTerm
            })
          )
          state.filterValues = payload.filterValues ?? {}
          state.items = applyFilters(state.itemsPreFilter, state.filterValues)
        })
        .addCase(EXECUTE_SEARCH, (state, { payload }) => {
          state.itemsPreFilter = current(state).origItems.filter((item) =>
            searchObject({
              item,
              searchTerm: payload.searchTerm
            })
          )
          state.items = applyFilters(state.itemsPreFilter, state.filterValues)
          state.searchTerm = payload.searchTerm
        })
        .addCase(INIT_COLUMN_HEADER_CONTEXT_MENU, (state, { payload }) => {
          state.columnHeaderContextMenu = payload as any
        })
        .addCase(DISMISS_COLUMN_HEADER_CONTEXT_MENU, (state) => {
          state.columnHeaderContextMenu = null
        })
        .addCase(SET_GROUP_BY, (state, { payload }) => {
          state.groupBy =
            payload.column?.fieldName === state.groupBy?.fieldName
              ? null
              : payload.column
        })
        .addCase(SET_FILTER_BY, (state, { payload }) => {
          state.filterBy = payload.column
          state.filterPanel = {
            open: true
          }
        })
        .addCase(SET_SORT, (state, { payload }) => {
          const newSortBy = [
            payload.column.fieldName,
            payload.direction
          ] as SortOptions
          state.sortOpts = _.isEqual(state.sortOpts, newSortBy)
            ? null
            : newSortBy
        })
        .addCase(TOGGLE_FILTER_PANEL, (state) => {
          state.filterPanel = {
            open: !state.filterPanel?.open
          }
          if (!state.filterPanel?.open) {
            state.filterBy = null
          }
        })
        .addCase(TOGGLE_VIEW_COLUMNS_PANEL, (state) => {
          state.viewColumnsPanel = {
            open: !state.viewColumnsPanel?.open
          }
        })
        .addCase(FILTERS_UPDATED, (state, { payload }) => {
          state.filters = payload.filters
          state.items = _.filter(
            state.origItems,
            (entry) =>
              _.filter(payload.filters, (f) =>
                f.selected.has(get(entry, f.key, { default: '' }))
              ).length === payload.filters.length
          )
        })
        .addCase(UPDATE_COLUMNS, (state, { payload }) => {
          state.columns = payload
        })
    )
  }, [])
  return useReducer(reducer, initialState)
}
