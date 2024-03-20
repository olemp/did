import { useProjectsContext } from '../../../context'

/**
 * Custom hook for budget tracking. For now the used hours
 * are hardcoded to `40` but in the future this should be
 * in the state of the component.
 *
 * @param hours The number of hours.
 *
 * @returns An object containing budget tracking information.
 */
export const useBudgetTracking = (hours = 40) => {
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
