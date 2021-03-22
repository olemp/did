/* eslint-disable tsdoc/syntax */
import $date from 'DateUtils'
import { ActionButton } from 'office-ui-fabric-react'
import { bugs } from 'package'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styles from './ErrorFallback.module.scss'
import { IErrorFallbackProps } from './types'

/**
 * Generate new issue GitHub URL
 *
 * @param error - Error
 */
export const generateNewIssueUrl = (error: Error) => {
  return [
    `${bugs.url}/new`,
    '?',
    [
      'labels=bug',
      'template=bug_report.md',
      `body=\`\`\`${error.stack}\`\`\``,
      `title=${error.stack.split('at')[0]}`
    ].join('&')
  ].join('')
}

/**
 * Error fallback for `<ErrorBoundary />`  from
 * `react-error-boundary`
 *
 * @category Function Component
 */
export const ErrorFallback = ({
  error,
  resetErrorBoundary
}: IErrorFallbackProps) => {
  const { t } = useTranslation()
  return (
    <div role='alert' className={styles.root}>
      <div className={styles.header}>{t('common.errorFallbackHeader')}</div>
      <pre>
        {t('common.timeLabel')}:{' '}
        {$date.formatDate(new Date(), 'MMM DD, YYYY HH:mm')}
      </pre>
      <pre>
        {t('common.error')}: {error.message}
      </pre>
      <div>
        <ActionButton
          iconProps={{ iconName: 'GitGraph' }}
          href={generateNewIssueUrl(error)}
          target='_blank'
          text={t('common.githubIssueReportLinkText')}
        />
        <ActionButton
          iconProps={{ iconName: 'Refresh' }}
          onClick={resetErrorBoundary}
          text={t('common.tryAgainText')}
        />
      </div>
    </div>
  )
}
