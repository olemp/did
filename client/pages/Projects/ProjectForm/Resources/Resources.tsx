import {
  FormGroup,
  UserPickerControl,
  useFormContext
} from 'components/FormControl'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ProjectFormTabComponent } from '../types'
import { useResources } from './useResources'

export const Resources: ProjectFormTabComponent = () => {
  const { t } = useTranslation()
  const { register } = useFormContext()
  const { additionalMetadata, allowEdit, onRenderValue } = useResources()

  return (
    <FormGroup gap={15}>
      <UserPickerControl
        {...register('projectOwner', {}, Resources.extensionId)}
        label={t('projects.resources.projectOwnerLabel')}
        placeholder={t('projects.resources.projectOwnerPlaceholder')}
      />
      <UserPickerControl
        {...register('resources', {}, Resources.extensionId)}
        label={t('projects.resources.resourcesLabel')}
        placeholder={t('projects.resources.resourcesPlaceholder')}
        multiple
        additionalMetadata={additionalMetadata}
        list={{
          allowEdit,
          onRenderValue
        }}
        freeform
      />
    </FormGroup>
  )
}

Resources.displayName = 'Resources'
Resources.extensionId = '2dfbce96-947f-4c26-95b4-5eda10616074'
Resources.extensionDescription = 'Resources for the project'
