/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation } from '@apollo/client'
import { useToast } from 'components'
import { ISubmitProps } from 'components/FormControl'
import { useTranslation } from 'react-i18next'
import _ from 'underscore'
import s from 'underscore.string'
import $addOrUpdateReportLink from './addOrUpdateReportLink.gql'
import { IReportLinksFormProps } from './types'
import { useReportLinksModel } from './useReportLinksModel'

export function useReportsFormSubmit(
  props: IReportLinksFormProps,
  model: ReturnType<typeof useReportLinksModel>
): ISubmitProps {
  const { t } = useTranslation()
  const [mutate, { loading }] = useMutation($addOrUpdateReportLink)
  const [toast, setToast] = useToast(8000, { isMultiline: true })

  /**
   * On save report link function callback.
   */
  const onSave = async () => {
    try {
      await mutate({
        variables: {
          reportLink: _.omit(model.$, '__typename'),
          update: !!props.edit
        }
      })
      setToast({
        text: !props.edit
          ? t('admin.reportLinks.createSuccess', model.$)
          : t('admin.reportLinks.updateSuccess', model.$),
        type: 'success'
      })
      model.reset()
      props.onSave(model.$)
    // eslint-disable-next-line unicorn/prefer-optional-catch-binding
    } catch(error) {
      // eslint-disable-next-line no-console
      console.log(error)
      setToast({
        text: !props.edit
          ? t('admin.reportLinks.createError')
          : t('admin.reportLinks.updateError'),
        type: 'error'
      })
    }
  }

  /**
   * Checks if form is valid
   */
  const isFormValid = (): boolean =>
    !s.isBlank(model.value('name', ''))

  return {
    toast,
    text: t('common.save'),
    onClick: onSave,
    disabled: !isFormValid() || loading
  } as const
}
