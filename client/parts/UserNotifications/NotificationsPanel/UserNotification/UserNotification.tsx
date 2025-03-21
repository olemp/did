import { UserMessage } from 'components'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { StyledComponent } from 'types'
import { UserNotificationsContext } from '../../context'
import styles from './UserNotification.module.scss'
import { IUserNotificationProps } from './types'

/**
 * @category Function Component
 */
export const UserNotification: StyledComponent<IUserNotificationProps> = ({
  model
}) => {
  const { t } = useTranslation()
  const { dismissNotification } = useContext(UserNotificationsContext)
  return (
    <UserMessage
      {...model.alertProps}
      className={UserNotification.className}
      text={model.text}
      onClick={() => window.open(model.moreLink, '_self')}
      action={{
        text: t('notifications.dismissText'),
        onClick: () => dismissNotification(model.id),
        iconName: 'DeleteDismiss',
        iconColor: 'var(--colorPaletteRedForeground1)'
      }}
    />
  )
}

UserNotification.displayName = 'UserNotification'
UserNotification.className = styles.userNotification
