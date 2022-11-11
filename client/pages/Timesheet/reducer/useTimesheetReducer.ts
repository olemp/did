/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { ITimesheetParameters, ITimesheetProps } from '../types'
import { createTimesheetReducer } from './createTimesheetReducer'
import { initState } from './initState'

/**
 * Use Timesheet reducer
 *
 * @param props - Timesheet props
 */
export function useTimesheetReducer(props: ITimesheetProps) {
  const { t } = useTranslation()
  const url = useParams<ITimesheetParameters>()
  const reducer = useMemo(() => createTimesheetReducer({ t, url, props }), [])
  return useReducer(reducer, initState({ url, props }))
}
