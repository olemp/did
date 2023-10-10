import { OperationVariables } from '@apollo/client'
import { IFormControlProps } from 'components/FormControl'
import { ITabProps } from 'components/Tabs/types'
import { Customer, CustomerInput } from 'types'

export interface ICustomerFormProps
  extends ITabProps,
    IFormControlProps<Customer> {}

export interface CreateOrUpdateCustomerVariables extends OperationVariables {
  customer: CustomerInput
  update?: boolean
}