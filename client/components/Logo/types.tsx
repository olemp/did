import { HTMLAttributes } from 'react'

/**
 * @category Logo
 */
export interface ILogoProps extends HTMLAttributes<HTMLDivElement> {
  fillColor?: string // transparent
  strokeColor?: string // #3a0960
  strokeWidth?: string // 2
  backgroundColor?: string // transparent
  dropShadow?: boolean // false
  showMotto?: boolean // false
  width?: string // 100%
  height?: string // 100%
}
