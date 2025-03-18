import {
  CONTROL_REGISTRY,
  IDynamicButtonProps,
  IFormControlContext
} from 'components'
import { ComponentLogicHook } from 'hooks'
import _ from 'lodash'
import { useCallback, useMemo } from 'react'
import { CLEAR_VALIDATION_MESSAGES, useFormControlReducer } from './reducer'
import { FormInputControlBase, IFormControlProps } from './types'
import { useFormControlValidation } from './useFormControlValidation'

type UseFormControlReturnType = {
  context: IFormControlContext
  submitAction: IDynamicButtonProps
}

/**
 * Hook that returns an object with `footerActions` to be used in a form control.
 *
 * @param submitProps - The submit button props.
 *
 * @returns An object with `footerActions`.
 */
export const useFormControl: ComponentLogicHook<
  IFormControlProps,
  UseFormControlReturnType
> = (props) => {
  const [state, dispatch] = useFormControlReducer()
  const validateForm = useFormControlValidation(props, dispatch)

  const submitAction = useMemo<IDynamicButtonProps>(
    () => ({
      ...props.submitProps,
      onClick: async (event: any) => {
        dispatch(CLEAR_VALIDATION_MESSAGES())
        const fields = Object.values(CONTROL_REGISTRY[props.id])
        if (await validateForm(fields)) {
          if (props.panel?.onDismiss) {
            props.panel.onDismiss()
          }
          return props.submitProps.onClick(event)
        }
      },
      primary: true
    }),
    [props.submitProps]
  )

  /**
   * Retrieves the value of a specific extension property for a given key and extension ID.
   *
   * @param key - The key of the extension property.
   * @param extensionId - The ID of the extension.
   *
   * @returns The value of the extension property, or undefined if not found.
   */
  const getExtensionValue = <T = any>(key: string, extensionId: string) => {
    return _.get(
      props.model.$,
      `extensions.${extensionId}.properties.${key}`
    ) as T
  }

  const onBlurCallback = useCallback(
    ({ target }: React.FocusEvent<HTMLInputElement>) => {
      if (!props.validateOnBlur) return
      const [, name] = target.id.split('_')
      const fields = Object.values(
        CONTROL_REGISTRY[props.id]
      ) as FormInputControlBase[]
      const field = fields.find((f) => f.name === name)
      if (!field) return
      const validateFields = fields.filter(
        (f) =>
          f.name === field.name ||
          field.options?.connectedFields?.includes(f.name)
      )
      dispatch(CLEAR_VALIDATION_MESSAGES(validateFields.map((f) => f.name)))
      validateForm(validateFields)
    },
    [props.validateOnBlur, props.id, state, dispatch]
  )

  const context = useMemo<IFormControlContext>(
    () => ({
      ...state,
      ..._.pick(props, [
        'model',
        'register',
        'additionalContext',
        'isEditMode'
      ]),
      getExtensionValue,
      dispatch,
      onBlurCallback
    }),
    [state, props.model]
  )

  return { context, submitAction }
}
