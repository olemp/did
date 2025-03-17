import { User } from 'types'
import { IUserMetadataCellProps } from './SelectedUsersList'
import { ComboboxProps } from '@fluentui/react-components'
import { IDynamicButtonProps, IListProps } from 'components'

export type SingleUserPickerValue = string
export type UserInfo = {
  id: string
  [key: string]: any
}
export type MultiUserPickerValue = UserInfo[]
export type UserPickerValue = SingleUserPickerValue | MultiUserPickerValue

type UserWithMetadata = User & {
  additionalMetadata?: Record<string, string>
}

export type AdditionalMetadataField<P = Record<string, any>> = {
  type: 'text' | 'number' | 'choice'
  label: string
  required?: boolean
  renderAs?: 'currency'
  props?: P
}

export interface IUserPickerProps extends Pick<IListProps, 'hideEmptyMessage'> {
  /**
   * The placeholder text for the user picker.
   */
  placeholder?: string

  /**
   * The value of the user picker.
   */
  value?: UserPickerValue

  /**
   * Change handler for the user picker.
   *
   * @param selectedUsers The selected users.
   */
  onChange?: (selectedUsers: User[]) => void

  /**
   * Whether the user picker should allow selecting multiple users.
   * If true, the user picker will show a list of selected users.
   */
  multiple?: boolean

  /**
   * Additional metadata to be stored with the users.
   * Only used when `multiple` is true.
   */
  additionalMetadata?: Record<string, AdditionalMetadataField>

  /**
   * Configuration for the list of selected users. Only applicable when `multiple` is true.
   */
  list?: {
    /**
     * Allow to edit users in the list. Only applicable when `multiple` is true.
     */
    allowEdit?: boolean

    /**
     * Custom renderer for the additional metadata cell.
     *
     * @param value Value of the cell.
     * @param props Props for the cell.
     */
    onRenderValue?: (
      value: string | number,
      props: IUserMetadataCellProps
    ) => any

    /**
     * Render the list in a simple mode.
     */
    simple?: boolean
  }

  /**
   * Whether the user picker should allow freeform input.
   */
  freeform?: ComboboxProps['freeform']

  /**
   * Custom action for the user picker.
   */
  customAction?:
    | IDynamicButtonProps
    | ((state: IUserPickerState) => IDynamicButtonProps)

  /**
   * Whether the user picker should take up the full width.
   */
  fullWidth?: boolean

  /**
   * Auto select users without having to click on
   * the add button. This is default behavior for
   * single user pickers, so it is only applicable
   * when `multiple` is `true`.
   */
  autoSelect?: boolean
}

export interface IUserPickerState {
  /**
   * Whether the data for the user picker has been loaded.
   */
  isDataLoaded: boolean

  /**
   * All the available users in the picker.
   * This is used to populate the picker.
   * This is handled by the `useUserPickerQuery` hook.
   */
  users: User[]

  /**
   * The currently selected user in the picker.
   */
  selectedUser?: UserWithMetadata

  /**
   * The currently selected users in the list.
   * This is only used when `multiple` is true.
   */
  selectedUsers?: UserWithMetadata[]

  /**
   * The search term for the user picker.
   */
  searchTerm?: string
}
