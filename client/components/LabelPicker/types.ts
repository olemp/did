import gql from 'graphql-tag'
import { ILabel } from 'types'

export interface ILabelPickerProps {
  className?: string
  label: string
  searchLabelText: string
  defaultSelectedKeys?: string[]
  onChange: (labels: ILabel[]) => void
}

export const GET_LABELS = gql`
  query {
    labels {
      name
      description
      color
      icon
    }
  }
`
