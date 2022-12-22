/* eslint-disable tsdoc/syntax */
import { useTheme } from '@fluentui/react'
import { useAppContext } from 'AppContext'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { MenuItem } from '../MenuItem'

/**
 * Component that shows the user's timebank balance.
 *
 * @category UserMenu
 */
export const UserTimebank: FC = () => {
  const { t } = useTranslation()
  const { palette } = useTheme()
  const { user } = useAppContext()
  return (
    <MenuItem
      iconProps={{ iconName: 'HourGlass' }}
      text={t('common.timebankSummaryText', user?.timebank)}
      textStyle={{
        color: palette.neutralPrimary
      }}
    />
  )
}
