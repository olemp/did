/* eslint-disable tsdoc/syntax */
import { DateRangeType } from '@fluentui/react'
import { TabContainer } from 'components'
import { HotkeyModal } from 'components/HotkeyModal'
import React, { FC } from 'react'
import { GlobalHotKeys } from 'react-hotkeys'
import { useTranslation } from 'react-i18next'
import { ActionBar } from './ActionBar'
import { AllocationView } from './AllocationView'
import { ErrorBar } from './ErrorBar'
import { useTimesheet } from './hooks'
import { useHotkeys } from './hotkeys/useHotkeys'
import { Overview } from './Overview'
import { CHANGE_VIEW, TOGGLE_SHORTCUTS } from './reducer/actions'
import { StatusBar } from './StatusBar'
import { SummaryView } from './SummaryView'
import { TimesheetContext, TimesheetView } from './types'

/**
 * @category Function Component
 */
export const Timesheet: FC = () => {
  const { t } = useTranslation()
  const { state, dispatch, context } = useTimesheet()
  const { hotkeysProps } = useHotkeys(context)

  return (
    <TimesheetContext.Provider value={context}>
      <GlobalHotKeys {...hotkeysProps}>
        <div>
          <ActionBar />
          <ErrorBar error={state.error} />
          <StatusBar />
          <TabContainer
            hidden={!!state.error}
            defaultSelectedKey={state.selectedView}
            onTabChanged={(itemKey) =>
              dispatch(CHANGE_VIEW({ view: itemKey as TimesheetView }))
            }
            itemProps={{
              headerButtonProps: { disabled: !!state.error }
            }}
          >
            <Overview
              headerButtonProps={{
                disabled: state.dateRangeType !== DateRangeType.Week,
                style: state.dateRangeType !== DateRangeType.Week ? { opacity: 0.1, cursor: 'none' } : {}
              }}
              headerText={t('timesheet.overviewHeaderText')}
              itemIcon='CalendarWeek'
            />
            <SummaryView
              itemKey='summary'
              headerText={t('timesheet.summaryHeaderText')}
              itemIcon='List'
            />
            <AllocationView
              headerButtonProps={{
                disabled: state.dateRangeType !== DateRangeType.Week,
                style: state.dateRangeType !== DateRangeType.Week ? { opacity: 0.1, cursor: 'none' } : {}
              }}
              itemKey='allocation'
              headerText={t('timesheet.allocationHeaderText')}
              itemIcon='ReportDocument'
            />
          </TabContainer>
        </div>
        <HotkeyModal
          {...hotkeysProps}
          isOpen={state.showHotkeysModal}
          onDismiss={() => dispatch(TOGGLE_SHORTCUTS())}
        />
      </GlobalHotKeys>
    </TimesheetContext.Provider>
  )
}
