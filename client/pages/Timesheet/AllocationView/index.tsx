
import { getValue as getValue } from 'helpers'
import randomColor from 'randomcolor'
import React, { useContext, useLayoutEffect, useRef, useState } from 'react'
import FadeIn from 'react-fade-in'
import { useTranslation } from 'react-i18next'
import { Bar, BarChart, Cell, Tooltip, TooltipProps, XAxis, YAxis } from 'recharts'
import { EventObject } from 'types'
import { find } from 'underscore'
import { truncateString } from 'utils/truncateString'
import { TimesheetContext } from '../context'
import styles from './AllocationView.module.scss'
import './Theme.scss'

/**
 * Calculates durations based on exp
 * 
 * @param {EventObject[]} events Events
 * @param {string} exp Expression (what to calculate durations based on, e.g. customer.name)
 * 
 * @category Timesheet
 */
export const GetAllocation = (events: EventObject[], exp: string): any[] => {
    const items = events.reduce((_items, entry) => {
        const val = getValue(entry, exp, null)
        if (val) {
            const item = find(_items, i => i.name === val.name)
            if (item) item.hours += entry.duration
            else {
                _items.push({
                    ...val,
                    hours: entry.duration
                })
            }
        }
        return _items
    }, [])
    return items.map(i => ({
        ...i,
        data: truncateString(i.name, 15),
        hours: parseFloat(i.hours.toFixed(1))
    }))
}

/**
 * Shows allocation charts for a user
 * 
 * @category Timesheet
 */
export const AllocationView = (): JSX.Element => {
    const { t } = useTranslation()
    const { selectedPeriod } = useContext(TimesheetContext)
    const [{ width, height }, setDimensions] = useState({ width: 0, height: 0 })
    const ref = useRef<HTMLDivElement>()

    useLayoutEffect(() => setDimensions({ width: ref.current.clientWidth, height: 400 }), [])

    const charts = {
        'project': t('timesheet.projectChartTitle'),
        'customer': t('timesheet.customerChartTitle'),
    }


    /**
     * Render tooltip
     * 
     * @param {TooltipProps} props Properties
     */
    const renderTooltip = (props: TooltipProps) => {
        const data = getValue(props, 'payload.0.payload')
        if (!data) return null

        return (
            <FadeIn delay={150} transitionDuration={300} className={styles.tooltip}>
                <div className={styles.title}>{data.name}</div>
                {data.__typename === 'Project' && <div className={styles.subTitle}>for {data.customer.name}</div>}
                <p className={styles.summary}>{data.description}</p>
                <p className={styles.value}>{data.hours} {t('common.hours')}</p>
            </FadeIn>
        )
    }

    return (
        <div className={styles.root} ref={ref}>
            {Object.keys(charts).map(key => {
                const title = charts[key]
                const data = GetAllocation(selectedPeriod.events, key)
                return (
                    <FadeIn
                        key={key}
                        className={styles.chartContainer}
                        transitionDuration={1600}
                        delay={200}>
                        <div className={styles.title}>{title}</div>
                        <BarChart
                            className={styles.chart}
                            width={width}
                            height={height}
                            data={data}>
                            <XAxis
                                interval={0}
                                width={150}
                                dataKey='data' />
                            <YAxis
                                label={{
                                    value: t('common.hours').toString(),
                                    angle: -90,
                                    position: 'insideLeft'
                                }} />
                            <Tooltip content={renderTooltip} />
                            <Bar
                                dataKey='hours'
                                name={t('common.hours').toString()}>
                                {
                                    data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={randomColor({
                                                seed: entry.name,
                                                luminosity: 'light'
                                            })} />
                                    ))
                                }
                            </Bar>
                        </BarChart>
                    </FadeIn>
                )
            })}
        </div>
    )
}