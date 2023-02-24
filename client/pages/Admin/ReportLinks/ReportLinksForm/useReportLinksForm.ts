import { useFormControls } from 'components/FormControl'
import { IReportLinksFormProps } from './types'
import { useReportsFormSubmit } from './useReportsFormSubmit'
import { useReportLinksModel } from './useReportLinksModel'

export function useReportLinksForm(props: IReportLinksFormProps) {
  const model = useReportLinksModel(props)
  const register = useFormControls(model)
  const submit = useReportsFormSubmit(props, model)
  return {
    model,
    register,
    submit
  } as const
}
