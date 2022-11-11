import { DateRangeType, IColumn } from '@fluentui/react'
import $date from 'DateUtils'
import { useTranslation } from 'react-i18next'
import _ from 'underscore'
import { EventObject, Project } from 'types'
import { useTimesheetContext } from '../context'

export function useRowGenerator(columns: IColumn[]) {
  const { t } = useTranslation()
  const { state } = useTimesheetContext()
  function generateTotalRow() {
    switch (state.dateRangeType) {
      case DateRangeType.Week: {
        const events = state.selectedPeriod?.getEvents(true) || []
        return [...columns].splice(1, columns.length - 2).reduce(
          (row, col) => {
            const sum = [...events]
              .filter(
                (event) =>
                  $date.formatDate(event.startDateTime, 'YYYY-MM-DD') ===
                  col.fieldName
              )
              .reduce((sum, event) => (sum += event.duration), 0)
            row[col.fieldName] = sum
            row.sum += sum
            return row
          },
          { label: t('common.sumLabel'), sum: 0 }
        )
      }
      case DateRangeType.Month: {
        return { label: t('common.sumLabel'), sum: 0 }
      }
    }
  }

  function generateRows() {
    switch (state.dateRangeType) {
      case DateRangeType.Week: {
        const events = state.selectedPeriod?.getEvents(true) || []
        const projects = [
          ..._.unique(
            _.filter(
              events.map((event_) => event_.project),
              (p) => !!p
            ),
            (p: Project) => p?.tag
          ),
          { name: t('common.unconfirmedHours'), customer: { name: '' }, tag: null }
        ]
        return projects.map((project) => {
          const projectEvents = events.filter(
            (event) =>
              event.project?.tag === project.tag || (!project.tag && !event.project)
          )
          return [...columns].splice(1, columns.length - 2).reduce(
            (object, col) => {
              const sum = [...projectEvents]
                .filter(
                  (event) =>
                    $date.formatDate(event.startDateTime, 'YYYY-MM-DD') ===
                    col.fieldName
                )
                .reduce((sum, event) => (sum += event.duration), 0)
              object[col.fieldName] = sum
              object.sum += sum
              return object
            },
            {
              sum: 0,
              project,
              customer: project.customer
            }
          )
        })
      }
      case DateRangeType.Month: {
        const events: EventObject[] = [].concat.apply([], state.periods.map(period => period.getEvents(true)))
        const projects = [
          ..._.unique(
            _.filter(
              events.map((event_) => event_.project),
              (p) => !!p
            ),
            (p: Project) => p?.tag
          ),
          { name: t('common.unconfirmedHours'), customer: { name: '' }, tag: null }
        ]
        return projects.map((project) => {
          return state.periods.reduce(
            (row, period) => {
              const sum = period
                .getEvents(true)
                .filter(
                  (event) =>
                    event.project?.tag === project.tag || (!project.tag && !event.project)
                )
                .reduce((sum, event) => (sum += event.duration), 0)
              row[period.id] = sum
              row.sum += sum
              return row
            },
            {
              sum: 0,
              project,
              customer: project.customer
            }
          )
        })
      }
    }
  }


  return { generateTotalRow, generateRows } as const
}