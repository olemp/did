import {SearchProject, UserMessage} from 'components'
import {MessageBarButton, Panel} from 'office-ui-fabric-react'
import {ITimesheetContext, TimesheetContext} from 'pages/Timesheet/context'
import {MANUAL_MATCH} from 'pages/Timesheet/reducer/actions'
import React, {useContext, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {Project} from 'types'
import styles from './MatchEventPanel.module.scss'
import {IMatchEventPanelProps} from './types'

export const MatchEventPanel = ({event}: IMatchEventPanelProps) => {
  const {t} = useTranslation()
  const {dispatch} = useContext<ITimesheetContext>(TimesheetContext)
  const [isPanelVisible, setPanelVisibility] = useState(false)

  const hidePanel = () => setPanelVisibility(false)
  const showPanel = () => setPanelVisibility(true)

  /**
   * On manual match. Dispatches action type MANUAL_MATCH
   *
   * @param project - Project to match the event to
   */
  const onManualMatch = (project: Project) => {
    hidePanel()
    dispatch(MANUAL_MATCH({eventId: event.id, project}))
  }

  return (
    <span className={styles.root}>
      <MessageBarButton
        text={t('timesheet.resolveProjectButtonLabel')}
        title={t('timesheet.resolveProjectButtonLabel')}
        iconProps={{iconName: 'ReviewResponseSolid'}}
        onClick={showPanel}
      />
      <Panel
        isOpen={isPanelVisible}
        isLightDismiss={true}
        headerText={t('timesheet.matchEventPanelHeaderText')}
        onDismiss={hidePanel}>
        <div className={styles.subText}>{event.title}</div>
        <UserMessage
          iconName='OutlookLogo'
          text={t('timesheet.matchOutlookInfoText', event)}
        />
        <UserMessage
          hidden={!event.suggestedProject}
          containerStyle={{marginTop: 10}}
          iconName='Lightbulb'>
          <p>
            <span>{t('timesheet.didYouMeanText')}</span>
            <a href='#' onClick={() => onManualMatch(event.suggestedProject)}>
              {event.suggestedProject?.tag}
            </a>
            ?
          </p>
        </UserMessage>
        <UserMessage
          hidden={!event.customer || !!event.suggestedProject}
          containerStyle={{marginTop: 10}}
          text={t('timesheet.eventNotFullyMatchedText', {
            name: event.customer?.name
          })}
        />
        <SearchProject
          width='100%'
          className={styles.searchProject}
          onSelected={(project) => onManualMatch(project)}
          placeholder={t('common.searchPlaceholder')}
        />
      </Panel>
    </span>
  )
}
