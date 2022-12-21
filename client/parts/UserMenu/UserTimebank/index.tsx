/* eslint-disable tsdoc/syntax */
import { useTheme } from '@fluentui/react'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { MenuItem } from '../MenuItem'

/**
 * @category UserMenu
 */
export const UserTimebank: FC = () => {
  const { t } = useTranslation()
  const { palette } = useTheme()
  return (
    <MenuItem
      iconProps={{ iconName: 'HourGlass' }}
      text={t('common.timebankSummaryText', { hoursAvailable: 15 })}
      textStyle={{
        color: palette.neutralPrimary
      }}
    />
  )
}
