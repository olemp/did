/* eslint-disable tsdoc/syntax */
import get from 'get-value'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { IDurationColumnProps } from './types'

/**
 * @category Function Component
 */
export const DurationColumn: FC<IDurationColumnProps> = ({
  row,
  column
}: IDurationColumnProps) => {
  const { t } = useTranslation()
  const style = { ...get(column, 'data.style', { default: {} }) }

  if (row.label === t('common.sumLabel')) style.fontWeight = 500

  const colValue = row[column.fieldName]
    ? Number.parseFloat(row[column.fieldName]).toFixed(2)
    : null

  return <div style={style}>{colValue}</div>
}
