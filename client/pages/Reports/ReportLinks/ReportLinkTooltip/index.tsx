/* eslint-disable react-hooks/exhaustive-deps */
import { TooltipHost } from '@fluentui/react'
import $date from 'DateUtils'
import React, { FC } from 'react'
import { ReportLink } from 'types'
import styles from './Reports.module.scss'

/**
 * Report link tooltip
 *
 * @category Reports
 */
export const ReportLinkTooltip: FC<{ link: ReportLink }> = ({ link, children }) => {
    return (
        <TooltipHost
            content={(
                <div className={styles.root}>
                    <h2>{link.name}</h2>
                    <p>{link.description}</p>
                    <p>Updated by Steffen R. Norby on {$date.formatDate(link.updatedAt, 'MMM DD, YYYY HH:mm')}</p>
                </div>
            )}>
            {children}
        </TooltipHost>
    )
}
