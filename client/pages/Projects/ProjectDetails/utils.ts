import { filter } from 'underscore'
import { getSum } from 'utils/getSum'
import { TFunction } from 'i18next'

/**
 * Get summary
 *
 * @param {any[]} timeentries Time entries
 * @param {TFunction} t Translate function
 */
export function getSummary(timeentries: any[], t: TFunction) {
  return [
    {
      label: t('common.hoursCurrentMonth'),
      value: getSum(
        filter(timeentries, (entry) => entry.monthNumber === new Date().getMonth() + 1),
        'duration'
      )
    },
    {
      label: t('common.hoursPrevMonth'),
      value: getSum(
        filter(timeentries, (entry) => entry.monthNumber === new Date().getMonth()),
        'duration'
      )
    },
    {
      label: t('common.hoursCurrentYear'),
      value: getSum(
        filter(timeentries, (entry) => entry.year === new Date().getFullYear()),
        'duration'
      )
    }
  ]
}
