import { useMutation } from '@apollo/client'
import { useAppContext } from 'AppContext'
import { FormSubmitHook } from 'components/FormControl'
import { useTranslation } from 'react-i18next'
import $create_or_update_project from './create-or-update-project.gql'
import { IProjectFormProps } from './types'
import { useProjectFormOptions } from './useProjectFormOptions'
import { useProjectModel } from './useProjectModel'

/**
 * Returns submit props used by `<FormControl />`
 *
 * @param props - Props
 * @param model - Model
 *
 * @returns `toast`, `onClick` and `disabled`
 */
export const useProjectFormSubmit: FormSubmitHook<
  IProjectFormProps,
  ReturnType<typeof useProjectModel>,
  ReturnType<typeof useProjectFormOptions>
> = (props, model, options) => {
  const { t } = useTranslation()
  const { setToast } = useAppContext()
  const [mutate, { loading }] = useMutation($create_or_update_project)

  /**
   * On form submit
   */
  async function onClick() {
    try {
      await mutate({
        variables: {
          project: model.$,
          options: options.$,
          update: !!props.edit
        }
      })
      setToast({
        text: props.edit
          ? t('projects.updateSuccess', {
            projectId: model.projectId,
            name: model.$.name
          })
          : t('projects.createError', {
          projectId: model.projectId,
          name: model.$.name
        }),
        intent: 'success'
      })
      model.reset()
      props.refetch()
    } catch {
      setToast({
        text: props.edit
          ? t('projects.updateError')
          : t('projects.createError'),
        intent: 'error'
      })
    }
  }
  return {
    text: props.edit ? t('common.save') : t('common.add'),
    onClick,
    disabled: loading
  }
}
