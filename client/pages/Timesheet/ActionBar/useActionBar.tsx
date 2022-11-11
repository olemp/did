/* eslint-disable unicorn/prefer-query-selector */
import { DateRangeType, ICommandBarProps } from '@fluentui/react'
import { useToggle } from 'hooks'
import { useTimesheetContext } from '../context'
import { usePeriodCommands } from './selectPeriodCommands'
import { useDateRangePickerCommand } from './useDateRangePickerCommand'
import { useNavigateCommands } from './useNavigateCommands'
import { useSubmitCommands } from './useSubmitCommands'

/**
 * @category Timesheet
 */
export function useActionBar() {
  const { state } = useTimesheetContext()
  const navigateCommands = useNavigateCommands()
  const submitCommands = useSubmitCommands()
  const periodCommands = usePeriodCommands()
  const [showWeekPicker, toggleWeekPicker] = useToggle(false)
  const { dateRangePickerCommands, target } = useDateRangePickerCommand(toggleWeekPicker)

  const commandBarProps: ICommandBarProps = {
    styles: { root: { padding: 0 } },
    items: [...navigateCommands, ...dateRangePickerCommands, ...periodCommands],
    farItems: state.dateRangeType === DateRangeType.Week && [submitCommands]
  }

  return {
    commandBarProps,
    showWeekPicker,
    toggleWeekPicker,
    target
  }
}
