import {TFunction} from 'i18next'
import {IColumn} from 'office-ui-fabric-react'
import {createContext} from 'react'
import {SummaryViewAction} from './reducer'
import {ISummaryViewRow, ISummaryViewScope, ISummaryViewState} from './types'

export interface ISummaryViewContext extends ISummaryViewState {
  /**
   * Dispatcher
   */
  dispatch?: React.Dispatch<SummaryViewAction>

  /**
   * Translate function
   */
  t: TFunction

  /**
   * Loading data
   */
  loading?: boolean

  /**
   * Scopes
   */
  scopes: ISummaryViewScope[]

  /**
   * Columns
   */
  columns: IColumn[]

  /**
   * Rows
   */
  rows: ISummaryViewRow[]
}

export const SummaryViewContext = createContext<ISummaryViewContext>(null)
