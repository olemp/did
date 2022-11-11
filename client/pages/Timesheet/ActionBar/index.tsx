/* eslint-disable unicorn/prefer-query-selector */
/* eslint-disable tsdoc/syntax */
import { CommandBar } from '@fluentui/react'
import React from 'react'
import { useActionBar } from './useActionBar'
import { DateRangePicker } from './DateRangePicker'

/**
 * @category Timesheet
 */
export const ActionBar = () => {
  const { commandBarProps, showWeekPicker, toggleWeekPicker, target } =
    useActionBar()

  return (
    <div>
      <CommandBar {...commandBarProps} />
      <DateRangePicker
        target={target}
        hidden={!showWeekPicker}
        onDismiss={toggleWeekPicker}
      />
    </div>
  )
}
