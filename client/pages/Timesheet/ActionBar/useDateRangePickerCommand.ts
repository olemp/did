/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable tsdoc/syntax */
import { DateRangeType, IContextualMenuItem } from '@fluentui/react'
import { useTimesheetContext } from 'pages'
import { useRef } from 'react'
import { isMobile } from 'react-device-detect'
import { useTranslation } from 'react-i18next'

/**
 * @category Timesheet
 */
export function useDateRangePickerCommand(onClick: React.DispatchWithoutAction) {
  const { t } = useTranslation()
  const { state } = useTimesheetContext()
  const componentRef = useRef(null)
  const browserProps: Partial<IContextualMenuItem> = {
    text: state.scope.timespan,
    style: { paddingRight: 15 }
  }
  if (state.dateRangeType === DateRangeType.Week && state.periods.length === 1) {
    browserProps.text = `${state.selectedPeriod.getName(t)} (${state.scope.timespan})`
  }
  const mobileProps: Partial<IContextualMenuItem> = {
    iconProps: { iconName: 'Calendar' }
  }

  const dateRangePickerCommand: IContextualMenuItem = {
    key: 'TOGGLE_DATE_RANGE_PICKER',
    componentRef,
    onClick,
    ...(isMobile ? mobileProps : browserProps)
  }
  return {
    dateRangePickerCommand,
    target: componentRef?.current?._buttonElement?.current
  }
}
