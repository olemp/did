import { DeleteLink, EditLink } from 'components'
import React from 'react'
import { isMobile } from 'react-device-detect'
import { useTranslation } from 'react-i18next'
import { ReportLink } from 'types'
import { generateColumn as col } from 'utils/generateColumn'

/**
 * Columns hook for report link list
 */
export function useColumns({ onEdit, onDelete }) {
  const { t } = useTranslation()
  return [
    col('name', t('admin.reportLinks.nameLabel'), { maxWidth: 180 }),
    col('description', t('admin.reportLinks.descriptionLabel'), {
      isMultiline: true,
      maxWidth: 300,
      data: { hidden: isMobile }
    }),
    col('published', t('admin.reportLinks.publishedLabel')),
    col(null, null, { minWidth: 180 }, (reportLink: ReportLink) => (
      <div style={{ display: 'flex' }}>
        <EditLink style={{ marginRight: 12 }} onClick={() => onEdit(reportLink)} />
        <DeleteLink onClick={() => onDelete(reportLink)} />
      </div>
    ))
  ]
}
