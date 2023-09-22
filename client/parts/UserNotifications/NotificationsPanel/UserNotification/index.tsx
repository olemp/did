import { UserMessage } from 'components'
import React, { useContext } from 'react'
import FadeIn from 'react-fade-in'
import { useTranslation } from 'react-i18next'
import { StyledComponent } from 'types'
import { UserNotificationsContext } from '../../context'
import { IUserNotificationProps } from './types'
import styles from './UserNotification.module.scss'

/**
 * @category Function Component
 */
export const UserNotification: StyledComponent<IUserNotificationProps> = ({
  model
}) => {
  const { t } = useTranslation()
  const { dismissNotification } = useContext(UserNotificationsContext)
  return (
    <FadeIn>
      <UserMessage
        {...model.alertProps}
        className={UserNotification.className}
        actions={[
          {
            text: model.getMoreLinkText(t),
            onClick: () => window.open(model.moreLink, '_self'),
            iconName: 'CalendarPlay'
          },
          {
            text: t('notifications.dismissText'),
            onClick: () => dismissNotification(model.id),
            iconName: 'DeleteDismiss'
          }
        ]}
      >
        <span className={styles.text}>{model.text}</span>
      </UserMessage>
    </FadeIn>
  )
}

UserNotification.displayName = 'UserNotification'
UserNotification.className = styles.userNotification

export * from './types'
