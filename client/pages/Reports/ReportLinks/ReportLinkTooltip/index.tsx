/* eslint-disable react-hooks/exhaustive-deps */
import { TooltipHost } from '@fluentui/react'
import $date from 'DateUtils'
import React, { FC } from 'react'
import { ReportLink } from 'types'
import styles from './ReportLinkTooltip.module.scss'

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
                    <div className={styles.name}>{link.name}</div>
                    <p className={styles.description}>{link.description}</p>
                    <p className={styles.updated}>Updated by Steffen R. Norby on {$date.formatDate(link.updatedAt, 'MMM DD, YYYY HH:mm')}</p>
                </div>
            )}>
            {children}
        </TooltipHost>
    )
}
