import { Icon, TooltipHost, useTheme } from '@fluentui/react'
import React, { FC } from 'react'
import styles from './TimebankTooltip.module.scss'
import { ITimebankTooltipProps } from './types'

/**
 * Component for displaying timebank details for the event
 * in a tooltip using TooltipHost component from Fluent UI.
 *
 * @category Reusable Component
 */
export const TimebankTooltip: FC<ITimebankTooltipProps> = (props) => {
  const theme = useTheme()
  return (
    <TooltipHost>
      <span className={styles.root}>
        <Icon
          iconName='HourGlass'
          styles={{
            root: {
              color:
                props.event.timebank > 0
                  ? theme.palette.green
                  : theme.palette.red
            }
          }}
        />
      </span>
    </TooltipHost>
  )
}
