import { DateObject, default as DateUtils } from 'DateUtils'
import { TFunction } from 'i18next'
import {
  DatePicker,
  DateRangeType,
  DayOfWeek,
  FirstWeekOfYear,
  IContextualMenuItem,
  IDatePickerProps
} from 'office-ui-fabric-react'
import React from 'react'
import * as excelUtils from 'utils/exportExcel'
import { ISummaryViewContext } from './context'

const datePickerProps = (t: TFunction): IDatePickerProps => ({
  borderless: true,
  showWeekNumbers: true,
  showGoToToday: false,
  firstDayOfWeek: DayOfWeek.Monday,
  firstWeekOfYear: FirstWeekOfYear.FirstFourDayWeek,
  strings: t('common.calendarStrings', { returnObjects: true }) as any,
  calendarProps: {
    strings: t('common.calendarStrings', { returnObjects: true }) as any,
    dateRangeType: DateRangeType.Week
  }
})

/**
 * Command bar items
 *
 * @param context - Summary view context
 */
export const commandBar = (context: ISummaryViewContext) => {
  return {
    items: [
      {
        key: 'DATE_RANGE',
        name: DateUtils.getTimespanString(context.range.from, context.range.to),
        iconProps: { iconName: 'DateTime' },
        disabled: true,
        subMenuProps: {
          items: [
            {
              key: 'DATE_RANGE_FROM',
              onRender: () => (
                <div style={{ padding: 10 }}>
                  <DatePicker
                    {...datePickerProps(context.t)}
                    label={context.t('common.fromDateLabel')}
                    value={context.range.from.jsDate}
                    minDate={context.range.to.add('-8week').startOfWeek.jsDate}
                    maxDate={context.range.to.add('-2w').startOfWeek.jsDate}
                    onSelectDate={(date) =>
                      context.dispatch({
                        type: 'SET_RANGE',
                        payload: { from: new DateObject(date).startOfWeek }
                      })
                    }
                  />
                </div>
              )
            },
            {
              key: 'DATE_RANGE_TO',
              onRender: () => (
                <div style={{ padding: 10 }}>
                  <DatePicker
                    {...datePickerProps(context.t)}
                    label={context.t('common.toDateLabel')}
                    minDate={context.range.from.add('2w').endOfWeek.jsDate}
                    maxDate={context.range.from.add('8w').endOfWeek.jsDate}
                    value={context.range.to.jsDate}
                    onSelectDate={(date) =>
                      context.dispatch({
                        type: 'SET_RANGE',
                        payload: { to: new DateObject(date).endOfWeek }
                      })
                    }
                  />
                </div>
              )
            }
          ]
        }
      }
    ] as IContextualMenuItem[],
    farItems: [
      {
        key: 'EXPORT_TO_EXCEL',
        text: context.t('common.exportCurrentView'),
        iconProps: { iconName: 'ExcelDocument' },
        disabled: true,
        onClick: () => {
          excelUtils.exportExcel(context.rows, {
            columns: context.columns,
            fileName: `Summary-${new Date()
              .toDateString()
              .split(' ')
              .join('-')}.xlsx`
          })
        }
      }
    ]
  }
}
