import { useMap } from 'hooks'
import color from 'randomcolor'
import { useEffect } from 'react'
import { LabelInput } from 'types'
import { convertToMap } from 'utils/convertToMap'
import { ILabelFormProps } from '.'

const INITIAL_MODEL = convertToMap<keyof LabelInput>({
  name: '',
  description: '',
  color: color({
    luminosity: 'light'
  })
})

export function useLabelModel(props: ILabelFormProps) {
  const map = useMap<keyof LabelInput, LabelInput>(new Map())

  useEffect(() => {
    if (props.edit) map.$set(convertToMap(props.edit))
  }, [props.edit])

  useEffect(() => {
    map.$set(INITIAL_MODEL)
  }, [])

  return map
}
