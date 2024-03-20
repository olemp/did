import { StyledComponent } from 'types'
import { useProjectsContext } from '../../../context'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { InformationProperty } from 'components'
import { Field, ProgressBar } from '@fluentui/react-components'

const useBudgetTracking = (hours = 40) => {
  const context = useProjectsContext()
  const tracking = context.state.selected?.budgetTracking ?? {}
  const used = Number.parseFloat((hours / tracking.hours).toFixed(2))
  const getValidationStateFromThreshold = () => {
    if (used > tracking.criticalThreshold) return 'error'
    if (used > tracking.warningThreshold) return 'warning'
    return 'none'
  }
  return {
    budgetTrackingEnabled: tracking.trackingEnabled,
    hours,
    budget: tracking.hours,
    used,
    getValidationStateFromThreshold
  }
}

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
        <div>
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
