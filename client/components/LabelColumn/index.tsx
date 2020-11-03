import { Icon } from 'office-ui-fabric-react/lib/Icon'
import * as React from 'react'
import { isEmpty } from 'underscore'
import styles from './LabelColumn.module.scss'
import { EntityLabel } from 'components/EntityLabel'
import { ILabel } from 'types'
import { ILabelColumnProps } from './types'

export const LabelColumn = ({ label, project, customer }: ILabelColumnProps) => {
    if (project) {
        return (
            <div className={styles.root}>
                <div className={styles.iconContainer}>
                    <Icon iconName={project.icon || 'Page'} styles={{ root: { fontSize: 18 } }} />
                </div>
                <div className={styles.content}>
                    <div className={styles.title}>{project.name}</div>
                    <div className={styles.description}>for {customer.name}</div>
                    {!isEmpty(project.labels) && (
                        <div className={styles.labels}>
                            {project.labels.map((label: ILabel, idx: number) => (
                                <EntityLabel
                                    key={idx}
                                    label={label}
                                    size='xsmall' />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )
    }
    else if (label) return <div style={{ fontWeight: 500 }}>{label}</div>
    return null
}