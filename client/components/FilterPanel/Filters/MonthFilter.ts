import { getValue } from 'helpers'
import { unique, contains, indexOf } from 'underscore'
import DateUtils from 'utils/date'
import { BaseFilter, IFilter } from './BaseFilter'

export class MonthFilter extends BaseFilter {
  constructor(fieldName: string, public name: string) {
    super(fieldName)
  }

  /**
   * Intialize the MonthFilter
   *
   * @param {any[]} entries Entries
   */
  public initialize(entries: any[]): IFilter {
    const values = unique(entries.map((e) => getValue(e, this.fieldName, null)))
    const monthNames = DateUtils.getMonthNames()
    const items = monthNames
      .filter((_, idx) => contains(values, idx + 1))
      .map((value) => ({ key: indexOf(monthNames, value) + 1, value }))
    return {
      key: this.fieldName,
      name: this.name,
      items,
      selected: []
    }
  }
}
