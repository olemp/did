
import { getValue as getValue } from 'helpers'
import color from 'randomcolor'
import React, { useContext, useLayoutEffect, useMemo, useRef, useState } from 'react'
import FadeIn from 'react-fade-in'
import { useTranslation } from 'react-i18next'
import { Bar, BarChart, Cell, Tooltip, TooltipProps, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { EventObject } from 'types'
import { find, first } from 'underscore'
import { truncateString } from 'utils/truncateString'
import { TimesheetContext } from '../context'
import styles from './AllocationView.module.scss'
import { IChartConfig, IChartItem } from './types'
import './Theme.scss'
import { UserMessage } from 'components'

/**
 * Calculates durations based on key
 * 
 * @param {EventObject[]} events Events
 * @param {IChartConfig} chart Chart
 */
function getData<T>(events: EventObject[], chart: IChartConfig): IChartItem<T>[] {
    const items = events.reduce((_items, entry) => {
        const data = getValue(entry, chart.key, null)
        if (!data) return _items
        const item = find(_items, ({ id }) => id === data[chart.idKey])
        if (item) item.value += getValue(entry, chart.valueKey)
        else {
            _items.push({
                id: data[chart.idKey],
                chart,
                data,
                value: getValue(entry, chart.valueKey)
            })
        }
        return _items
    }, [])
    return items.map(i => ({
        ...i,
        label: truncateString(i.data[chart.textKey], 15),
        value: parseFloat(i.value.toFixed(1))
    }))
}

export const AllocationView = (): JSX.Element => {
    const { t } = useTranslation()
    const { selectedPeriod } = useContext(TimesheetContext)

    /**
     * Render tooltip
     * 
     * @param {TooltipProps} props Properties
     * @param {IChartConfig} chart Chart config
     */
    const renderTooltip = (props: TooltipProps, chart: IChartConfig) => {
        const { data, value } = getValue<any>(props, 'payload.0.payload.data', {})
        if (!data) return null
        return (
            <FadeIn className={styles.tooltip}>
                <div className={styles.text}>{getValue(data, chart.textKey)}</div>
                {chart.subTextKey && <div className={styles.subText}>{getValue(data, chart.subTextKey, '')}</div>}
                <p className={styles.summary}>{data.description}</p>
                <p className={styles.value}>{value} {chart.valuePostfix}</p>
            </FadeIn>
        )
    }

    if (selectedPeriod.totalDuration === 0) {
        return (
            <div className={styles.root}>
                <UserMessage text={'No data to show for the selected period.'} />
            </div>
        )
    }

    const charts: IChartConfig[] = [
        {
            key: 'project',
            title: t('timesheet.allocation.project'),
            colors: 'light',
            idKey: 'name',
            valueKey: 'duration',
            valuePostfix: t('common.hours'),
            textKey: 'name',
            subTextKey: 'customer.name'
        },
        {
            key: 'customer',
            title: t('timesheet.allocation.customer'),
            colors: 'light',
            idKey: 'name',
            valueKey: 'duration',
            valuePostfix: t('common.hours'),
            textKey: 'name'
        }
    ]

    return (
        <div className={styles.root} key={selectedPeriod.id}>
            {charts.map((c) => {
                const data = getData(selectedPeriod.events, c)
                return (
                    <div
                        key={c.key}
                        className={styles.chartContainer}>
                        <div className={styles.title}>{c.title}</div>
                        <ResponsiveContainer width='100%' height={450}>
                            <BarChart
                                className={styles.chart}
                                data={[...data]}>
                                <XAxis interval={0} dataKey='label' />
                                <YAxis
                                    label={{
                                        value: t('common.hours').toString(),
                                        angle: -90,
                                        position: 'insideLeft'
                                    }} />
                                <Tooltip content={({ payload }) => renderTooltip(payload, c)} />
                                <Bar
                                    dataKey='value'
                                    animationEasing='ease-in-out'
                                    animationDuration={1200}
                                    name={t('common.hours').toString()}>
                                    {
                                        data.map((entry) => (
                                            <Cell
                                                key={getValue(entry.data, c.idKey)}
                                                fill={color({
                                                    seed: getValue(entry.data, c.textKey),
                                                    luminosity: c.colors
                                                })} />
                                        ))
                                    }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )
            })}
        </div>
    )
}