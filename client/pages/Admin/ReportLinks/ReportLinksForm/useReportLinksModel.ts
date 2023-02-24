/* eslint-disable react-hooks/exhaustive-deps */
import { useMap } from 'hooks'
import { useEffect } from 'react'
import { convertToMap } from 'utils/convertToMap'
import { ReportLink } from '../../../../../server/graphql'
import { IReportLinksFormProps } from './types'

const INITIAL_MODEL = convertToMap<keyof ReportLink>({
  name: ''
})

export function useReportLinksModel(props: IReportLinksFormProps) {
  const map = useMap<keyof ReportLink, ReportLink>(new Map())

  useEffect(() => {
    if (props.edit) map.$set(convertToMap(props.edit))
  }, [props.edit])

  useEffect(() => {
    if (!props?.isOpen) {
      map.$set(INITIAL_MODEL)
    }
  }, [props?.isOpen])

  return {
    ...map,
    reset: () => map.$set(INITIAL_MODEL)
  } as const
}
