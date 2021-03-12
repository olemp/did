/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from 'react'
import { SubscriptionSettings } from 'types'

export interface ISubscriptionContext {
  settings: SubscriptionSettings
  onChange?: (key: string, value: any) => void
}

export const SubscriptionContext = createContext<ISubscriptionContext>(null)
