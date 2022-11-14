import { Label as LabelElement } from '@fluentui/react'
import React, { FC } from 'react'
import styles from './Information.module.scss'
import { IInformationPropertyProps } from './types'

export const InformationProperty: FC<IInformationPropertyProps> = (props) => {
  return (
    <div
      className={styles.property}
      hidden={props.value === null || props.value === ''}
    >
      <LabelElement>{props.title}:</LabelElement>
      <span>{props.value}</span>
      {props.children}
    </div>
  )
}
