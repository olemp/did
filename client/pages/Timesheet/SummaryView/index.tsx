/* eslint-disable tsdoc/syntax */
import { DateRangeType, PivotItem } from '@fluentui/react'
import { List, TabComponent, TabContainer } from 'components'
import React from 'react'
import { useTimesheetContext } from '../context'
import { CHANGE_DATE_RANGE_TYPE } from '../reducer/actions'
import styles from './SummaryView.module.scss'
import { useSummaryView } from './useSummaryView'

/**
 * @category Timesheet
 */
export const SummaryView: TabComponent = () => {
  const { dispatch } = useTimesheetContext()
  const props = useSummaryView()

  return (
    <div className={styles.root}>
      <TabContainer
        onTabChanged={(dateRangeType) =>
          dispatch(CHANGE_DATE_RANGE_TYPE({ dateRangeType: Number.parseInt(dateRangeType, 10) }))
        }>
        <PivotItem
          itemKey={DateRangeType.Week.toString()}
          headerText='Uke'>
          <List {...props} />
        </PivotItem>
        <PivotItem
          itemKey={DateRangeType.Month.toString()}
          headerText='Måned'>
          <List {...props} />
        </PivotItem>
      </TabContainer>
    </div>
  )
}
