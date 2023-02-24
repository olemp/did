import { useQuery } from '@apollo/client'
import { useCallback, useState } from 'react'
import $reportLinks from './reportLinks.gql'
import { IReportLinksFormProps } from './ReportLinksForm'
import { useColumns } from './useColumns'

/**
 * Component logic hook for `<ReportLinks />`
 *
 * @category Reports
 */
export function useReportLinks() {
  const query = useQuery($reportLinks, { fetchPolicy: 'cache-first' })
  const [form, setForm] = useState<IReportLinksFormProps>({
    isOpen: false
  })

  const onSave = useCallback(() => {
    query.refetch().then(() => setForm({ isOpen: false }))
  }, [query])

  const onDismiss = useCallback(() => {
    setForm({ isOpen: false })
  }, [])
  
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const columns = useColumns({ onEdit: () => {}, onDelete: () => {} })

  return {
    columns,
    form: {
      ...form,
      onSave,
      onDismiss
    },
    setForm,
    query
  } as const
}
