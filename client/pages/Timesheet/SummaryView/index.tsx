
import { DurationColumn } from 'components/DurationColumn'
import { LabelColumn } from 'components/LabelColumn'
import List from 'components/List'
import { IProject } from 'interfaces'
import { IColumn } from 'office-ui-fabric-react/lib/DetailsList'
import { MessageBar } from 'office-ui-fabric-react/lib/MessageBar'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { unique } from 'underscore'
import { capitalize } from 'underscore.string'
import dateUtils from 'utils/date'
import { TimesheetContext } from '../'
import { TimesheetScope } from '../TimesheetScope'
import styles from './SummaryView.module.scss'
import { isMobile } from 'react-device-detect'

/**
 * Creates columns from scope
 *  
 * @param {TimesheetScope} scope Timesheet scope
 */
function createColumns(scope: TimesheetScope) {
    const onRender = (row: any, _index: number, col: IColumn) => (
        <DurationColumn row={row} column={col} />
    )
    const columns = Array.from(Array(7).keys()).map(i => {
        const day = scope.getDay(i)
        return {
            key: day.format('L'),
            fieldName: day.format('L'),
            name: capitalize(day.format('ddd DD')),
            minWidth: 70,
            maxWidth: 70,
            onRender,
        }
    })
    return [
        {
            key: 'label',
            fieldName: 'label',
            name: '',
            minWidth: 350,
            maxWidth: 350,
            isMultiline: true,
            isResizable: true,
            onRender: (row: any) => <LabelColumn row={row} />,
        },
        ...columns,
        {
            key: 'sum',
            fieldName: 'sum',
            name: 'Sum',
            minWidth: 50,
            maxWidth: 50,
            isResizable: false,
            data: { style: { fontWeight: 500 } },
            onRender,
        },
    ]
}

/**
 * Generate rows
 * 
 * @param {any[]} events Events
 * @param {IColumn[]} columns Columns
 */
function generateRows(events: any[], columns: IColumn[]) {
    const projects = unique(events.map(e => e.project), (p: IProject) => p.id)
    return projects.map(project => {
        const projectEvents = events.filter(event => event.project.id === project.id)
        return [...columns].splice(1, columns.length - 2).reduce((obj, col) => {
            const sum = [...projectEvents]
                .filter(event => dateUtils.formatDate(event.startDateTime, 'L') === col.fieldName)
                .reduce((sum, event) => sum += event.duration, 0)
            obj[col.fieldName] = sum
            obj.sum += sum
            return obj
        }, { sum: 0, project, customer: project.customer })
    })
}

/**
 * Generate total row
 * 
 * @param {any[]} events Events
 * @param {IColumn[]} columns Columns
 * @param {string} label Label
 */
function generateTotalRow(events: any[], columns: IColumn[], label: string) {
    return [...columns].splice(1, columns.length - 2).reduce((obj, col) => {
        const sum = [...events]
            .filter(event => dateUtils.formatDate(event.startDateTime, 'L') === col.fieldName)
            .reduce((sum, event) => sum += event.duration, 0)
        obj[col.fieldName] = sum
        obj.sum += sum
        return obj
    }, { label, sum: 0 })
}

/**
 * @component SummaryView
 * @description Generates a summary view of events
 */
export const SummaryView = () => {
    const { t } = useTranslation('common')
    if (isMobile) {
        return <MessageBar styles={{ root: { marginTop: 8 } }}>{t('deviceViewNotSupported')}</MessageBar>
    } else {
        const context = React.useContext(TimesheetContext)
        const columns = createColumns(context.scope)

        const events = context.selectedPeriod.events.filter(e => e.project)

        const items = [
            ...generateRows(events, columns),
            generateTotalRow(events, columns, t('sumLabel')),
        ]

        return (
            <div className={styles.root}>
                <List {...{ columns, items }} enableShimmer={context && !!context.loading} />
            </div>
        )
    }
}
