import { FormControl } from 'components/FormControl'
import { TextControl } from 'components/FormControl/TextControl'
import { TextControlOptions } from 'components/FormControl/TextControl/types'
import { ToggleControl, ToggleControlOptions } from 'components/FormControl/ToggleControl'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import _ from 'underscore'
import { IReportLinksFormProps } from './types'
import { useReportLinksForm } from './useReportLinksForm'

export const ReportLinksForm: FC<IReportLinksFormProps> = (props) => {
  const { t } = useTranslation()
  const { register, submit } = useReportLinksForm(props)
  return (
    <FormControl
      submitProps={submit}
      panelProps={{
        ..._.omit(props, 'onSave'),
        headerText: !!props.edit
          ? t('admin.reportLinks.editReportLinkText')
          : t('admin.reportLinks.addNewReportText'),
        isLightDismiss: true
      }}
    >
      <TextControl
        {...register<TextControlOptions>('name')}
        spellCheck={false}
        maxLength={20}
        label={t('admin.reportLinks.nameLabel')}
        placeholder={t('admin.reportLinks.namePlaceholder')}
        description={t('admin.reportLinks.nameDescription')}
        required={!props.edit}
      />
      <TextControl
        {...register<TextControlOptions>('description')}
        spellCheck={false}
        maxLength={20}
        label={t('admin.reportLinks.descriptionLabel')}
        placeholder={t('admin.reportLinks.descriptionPlaceholder')}
        description={t('admin.reportLinks.descriptionDescription')}
        required={!props.edit}
      />
      <TextControl
        {...register<TextControlOptions>('externalUrl')}
        spellCheck={false}
        maxLength={20}
        label={t('admin.reportLinks.externalUrlLabel')}
        placeholder={t('admin.reportLinks.externalUrlPlaceholder')}
        description={t('admin.reportLinks.externalUrlDescription')}
        required={!props.edit}
      />
      <ToggleControl
        {...register<ToggleControlOptions>('published')}
        label={t('admin.reportLinks.publishedLabel')}
        description={t('admin.reportLinks.publishedDescription')}
      />
    </FormControl>
  )
}

export * from './types'
