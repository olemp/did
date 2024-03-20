import { StyledComponent } from 'types'
import { useProjectsContext } from '../../../context'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { InformationProperty } from 'components'
import { Field, ProgressBar } from '@fluentui/react-components'
import { useBudgetTracking } from './useBudgetTracking'
import styles from './BudgetTracking.module.scss'

/**
 * Shows details about the selected project.
 *
 * @category Projects
 */
export const BudgetTracking: StyledComponent = () => {
  const { t } = useTranslation()
  const context = useProjectsContext()
  const {
    budgetTrackingEnabled,
    hours,
    budget,
    used,
    getValidationStateFromThreshold
  } = useBudgetTracking()

  return (
    <InformationProperty
      hidden={!budgetTrackingEnabled}
      title='Budget'
      value={'a'}
      onRenderValue={() => (
        <div className={styles.budgetTracking}>
          <Field
            validationState={getValidationStateFromThreshold()}
            validationMessage={t('projects.budgetHoursUsed', {
              hours,
              budget
            })}
          >
            <ProgressBar value={used} />
          </Field>
        </div>
      )}
      isDataLoaded={!context.loading}
    />
  )
}
