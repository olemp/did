import { Icon } from '@fluentui/react'
import {
  ProjectLink,
  ProjectTooltip,
  UserMessage,
  UserMessageType
} from 'components'
import { TFunction } from 'i18next'
import { CLEAR_MANUAL_MATCH } from 'pages/Timesheet/reducer/actions'
import React, { FC } from 'react'
import { isMobile } from 'react-device-detect'
import { useTranslation } from 'react-i18next'
import _ from 'underscore'
import { useTimesheetContext } from '../../../context'
import { ClearManualMatchButton } from './ClearManualMatchButton'
import { IgnoreEventButton } from './IgnoreEventButton'
import { MatchEventPanel } from './MatchEventPanel'
import styles from './ProjectColumn.module.scss'
import { IProjectColumnProps } from './types'

/**
 * Get error message for event. Translate function is passed as parameter 
 * since it is not possible to use useTranslation hook inside a function.
 *
 * @param code - Error code
 * @param t - Translate function
 */
function getErrorMessage(
  code: string,
  t: TFunction
): [string, UserMessageType] {
  switch (code) {
    case 'PROJECT_INACTIVE':
      return [t('timesheet.projectInactiveErrorText'), 'error']
    case 'CUSTOMER_INACTIVE':
      return [t('timesheet.customerInactiveErrorText'), 'error']
    case 'EVENT_NO_TITLE':
      return [t('timesheet.eventNoTitleErrorText'), 'error']
  }
}

/**
 * Compponent for displaying project column in timesheet overview.
 */
export const ProjectColumn: FC<IProjectColumnProps> = (props) => {
  const { t } = useTranslation()
  const { state, dispatch } = useTimesheetContext()
  let className = styles.root
  if (isMobile) className += ` ${styles.mobile}`
  if (props.event.isSystemIgnored) {
    return null
  }
  if (!props.event.project) {
    if (props.event.error) {
      const [text, type] = getErrorMessage(props.event.error.code, t)
      return (
        <div className={className}>
          <UserMessage
            containerStyle={{ marginTop: 10 }}
            isMultiline={false}
            type={type}
            text={text}
          />
        </div>
      )
    }
    return (
      <div className={className}>
        <UserMessage
          containerStyle={{ marginTop: 10, width: '90%' }}
          isMultiline={true}
          type={'warning'}
          iconName='TagUnknown'
          text={t('timesheet.noProjectMatchFoundText')}
          actions={
            <div className={styles.eventActions}>
              <MatchEventPanel event={props.event} />
              <IgnoreEventButton event={props.event} />
            </div>
          }
        />
      </div>
    )
  }

  return (
    <div className={className}>
      <div className={styles.iconContainer}>
        <Icon iconName={props.event.project.icon} />
      </div>
      <div className={styles.content}>
        <ProjectTooltip project={props.event.project}>
          <div className={styles.link}>
            <ProjectLink project={props.event.project} />
          </div>
        </ProjectTooltip>
        {!_.isEmpty(props.event.project.labels) && (
          <Icon iconName='Tag' className={styles.labelIcon} />
        )}
        {props.event.manualMatch && !state.selectedPeriod.isConfirmed && (
          <ClearManualMatchButton
            onClick={() => dispatch(CLEAR_MANUAL_MATCH({ id: props.event.id }))}
            className={styles.clearButton}
          />
        )}
      </div>
    </div>
  )
}
