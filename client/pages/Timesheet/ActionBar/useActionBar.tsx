/* eslint-disable unicorn/prefer-query-selector */
/* eslint-disable tsdoc/syntax */
import { DateRangeType, ICommandBarProps } from '@fluentui/react'
import { useToggle } from 'hooks'
import { arrayExtend } from 'utils/arrayExtend'
import { useTimesheetContext } from '../context'
import { usePeriodCommands } from './selectPeriodCommands'
import { useNavigateCommands } from './useNavigateCommands'
import { useSubmitCommands } from './useSubmitCommands'
import { useDateRangePickerCommand } from './useDateRangePickerCommand'

/**
 * @category Timesheet
 */
export function useActionBar() {
  const { state } = useTimesheetContext()
  const navigateCommands = useNavigateCommands()
  const submitCommands = useSubmitCommands()
  const periodCommands = usePeriodCommands()
  const [showWeekPicker, toggleWeekPicker] = useToggle(false)
  const { dateRangePickerCommand, target } = useDateRangePickerCommand(toggleWeekPicker)

  const commandBarProps: ICommandBarProps = {
    styles: { root: { padding: 0 } },
    items: arrayExtend(
      [...navigateCommands, dateRangePickerCommand, ...periodCommands],
      { disabled: true },
      !!state.error
    ),
    farItems: state.dateRangeType === DateRangeType.Week && [submitCommands]
  }

  return {
    commandBarProps,
    showWeekPicker,
    toggleWeekPicker,
    target
  }
}
