import { List } from 'components'
import { ReusableComponent } from 'components/types'
import React from 'react'
import _ from 'underscore'
import styles from './EventList.module.scss'
import { IEventListProps } from './types'
import { useColumns } from './useColumns'

/**
 * Renders events in a list using `<List />` component
 *
 * Supports property `additionalColumns`
 *
 * @category Reusable Component
 */
export const EventList: ReusableComponent<IEventListProps> = (props) => {
  const columns = useColumns(props)
  return (
    <div className={EventList.className} hidden={props.hidden}>
      <List
        {..._.pick(
          props,
          'items',
          'hideToolbar',
          'hideEmptyMessage',
          'enableShimmer',
          'listGroupProps',
          'menuItems',
          'searchBox',
          'styles',
          'emptyMessage'
        )}
        columns={columns}
      />
    </div>
  )
}

EventList.displayName = 'EventList'
EventList.className = styles.eventList
EventList.defaultProps = {
  useTimeColumn: true,
  additionalColumns: []
}
