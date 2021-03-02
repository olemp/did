/* eslint-disable tsdoc/syntax */
import {AppContext} from 'AppContext'
import {Callout, Icon, Target} from 'office-ui-fabric-react'
import React, {FunctionComponent, useContext, useState} from 'react'
import {isMobile} from 'react-device-detect'
import FadeIn from 'react-fade-in'
import {useTranslation} from 'react-i18next'
import {Divider} from './Divider'
import styles from './UserMenu.module.scss'
import {UserReports} from './UserReports'
import {UserSettings} from './UserSettings'

/**
 * @category Function Component
 */
export const UserMenu: FunctionComponent = () => {
  const {t} = useTranslation()
  const {user, subscription} = useContext(AppContext)
  const [menuTarget, setMenuTarget] = useState<Target>(null)

  if (!subscription) return null

  return (
    <>
      <a
        className={styles.root}
        onClick={(event) => setMenuTarget(event.currentTarget)}>
        <Icon iconName={'PlayerSettings'} className={styles.icon} />
      </a>

      {menuTarget && (
        <Callout
          hidden={!menuTarget}
          target={menuTarget}
          onDismiss={() => setMenuTarget(null)}
          gapSpace={-8}>
          <FadeIn className={styles.menu}>
            <div className={`${styles.menuItem} ${styles.userName}`}>
              {user.displayName} |{' '}
              <span className={styles.role}>{user.role?.name}</span>
            </div>
            <div className={`${styles.menuItem} ${styles.mail}`}>
              {user.mail}
            </div>
            <Divider />
            <div className={styles.menuItem}>
              <Icon iconName='Home' className={styles.icon} />
              <span>{subscription.name}</span>
            </div>
            <span hidden={isMobile}>
              <Divider />
              <UserReports />
            </span>
            <Divider />
            <UserSettings className={styles.menuItem} />
            <Divider />
            <a
              href='/auth/signout'
              className={styles.menuItem}
              style={{paddingBottom: 25}}>
              <Icon iconName='SignOut' className={styles.icon} />
              <span>{t('common.signOutText')}</span>
              <span className={styles.version}>v{process.env.VERSION}</span>
            </a>
          </FadeIn>
        </Callout>
      )}
    </>
  )
}
