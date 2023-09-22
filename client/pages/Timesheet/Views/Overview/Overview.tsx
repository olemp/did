/* eslint-disable unicorn/prefer-ternary */
import { DateRangeType, Pivot, PivotItem } from '@fluentui/react'
import { mergeClasses } from '@fluentui/react-components'
import { EventList } from 'components'
import packageFile from 'package'
import React, { ReactElement } from 'react'
import { isMobile } from 'react-device-detect'
import { useTranslation } from 'react-i18next'
import _ from 'underscore'
import { useTimesheetContext } from '../../context'
import { CHANGE_PERIOD } from '../../reducer/actions'
import { TimesheetViewComponent } from '../types'
import { MatchEventPanel } from './MatchEventPanel'
import styles from './Overview.module.scss'
import { useOverview } from './useOverview'

/**
 * @category Timesheet
 */
export const Overview: TimesheetViewComponent = () => {
  const { t } = useTranslation()
  const { state, dispatch } = useTimesheetContext()
  const { additionalColumns, listGroupProps } = useOverview()
  let element: ReactElement = null
  switch (state.dateRangeType) {
    case DateRangeType.Week: {
      element = (
        <EventList
          hideToolbar={true}
          hidden={!!state.error}
          enableShimmer={!!state.loading}
          items={state.selectedPeriod?.getEvents()}
          dateFormat={packageFile.config.app.TIMESHEET_OVERVIEW_TIME_FORMAT}
          listGroupProps={listGroupProps}
          additionalColumns={additionalColumns}
        />
      )
    }
    case DateRangeType.Month: {
      if (state.loading && _.isEmpty(state.periods)) {
        element = (
          <EventList
            hideToolbar={true}
            enableShimmer={true}
            items={[]}
            listGroupProps={listGroupProps}
            additionalColumns={additionalColumns}
          />
        )
      } else {
        element = (
          <Pivot
            selectedKey={state.selectedPeriod?.id}
            onLinkClick={(item) => {
              dispatch(CHANGE_PERIOD({ id: item.props.itemKey }))
            }}
          >
            {state.periods.map((period) => (
              <PivotItem
                key={period.id}
                itemKey={period.id}
                headerText={period.getName(t)}
              >
                <EventList
                  hideToolbar={true}
                  hidden={!!state.error}
                  enableShimmer={!!state.loading}
                  items={period.getEvents()}
                  dateFormat={
                    packageFile.config.app.TIMESHEET_OVERVIEW_TIME_FORMAT
                  }
                  listGroupProps={listGroupProps}
                  additionalColumns={additionalColumns}
                />
              </PivotItem>
            ))}
          </Pivot>
        )
      }
    }
  }
  return (
    <div
      className={mergeClasses(Overview.className, isMobile && styles.mobile)}
    >
      {element}
      <MatchEventPanel />
    </div>
  )
}

Overview.id = 'overview'
Overview.displayName = 'Overview'
Overview.className = styles.overview
