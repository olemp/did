import { useMutation } from '@apollo/client'
import { FormSubmitHook, useFormControlModel } from 'components/FormControl'
import { useToast } from 'components/Toast'
import { useTranslation } from 'react-i18next'
import { omitTypename } from 'utils'
import { useCustomersContext } from '../context'
import $create_or_update_customer from './create-or-update-customer.gql'
import { ICustomerFormProps } from './types'

/**
 * Returns submit props used by `<FormControl />
`
 *
 * @param props - Props
 * @param model - Model
 *
 * @returns `toast`, `onClick` and `disabled`
 */
export const useCustomerFormSubmit: FormSubmitHook<
  ICustomerFormProps,
  ReturnType<typeof useFormControlModel>
> = (props, model) => {
  const { t } = useTranslation()
  const { refetch } = useCustomersContext()
  const [toast, setToast, isToastShowing] = useToast(8000)
  const [createOrUpdateCustomer, { loading }] = useMutation($create_or_update_customer)

  /**
   * On form submit
   */
  async function onClick() {
    const variables = {
      customer: omitTypename(model.$),
      update: !!props.edit
    }
    try {
      await createOrUpdateCustomer({ variables })
      setToast({
        text: variables.update
          ? t('customers.updateSuccess', variables.customer)
          : t('customers.createSuccess', variables.customer),
        onClick: () => {
          if (variables.update) return
          window.location.replace(
            `/customers/information/${variables.customer.key}`
          )
        },
        intent: 'success'
      })
      window.setTimeout(() => {
        model.reset()
        refetch()
      }, 1000)
    } catch {
      if (variables.update) {
        setToast({
          text: t('customers.updateError', variables.customer),
          intent: 'error'
        })
        return
      }
      setToast({
        text: t('customers.createError'),
        intent: 'error'
      })
    }
  }
  return {
    toast,
    text: props.edit ? t('common.save') : t('common.add'),
    onClick,
    disabled: loading || isToastShowing
  }
}
