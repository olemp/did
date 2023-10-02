import { HTMLAttributes } from 'react'

export interface IColorPickerFieldProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  fillColor: string
  onChanged: (color: string) => void
}
