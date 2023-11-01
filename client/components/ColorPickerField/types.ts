import { HTMLAttributes } from 'react'

export interface IColorPickerFieldProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The label of the field
   */
  label: string

  /**
   * The color value
   */
  color: string

  /**
   * The function to call when the color value changes
   */
  onChanged: (color: string) => void
}
