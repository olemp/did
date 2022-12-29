import { HTMLProps } from 'react'
import { EventObject } from 'types'

export interface ITimebankTooltipProps extends HTMLProps<HTMLDivElement> {
  event: EventObject
}
