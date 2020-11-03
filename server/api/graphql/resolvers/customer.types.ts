export interface ICustomer {
  key: string
  name: string
  description: string
  webLink: string
  externalSystemURL: string
  icon: string
  inactive?: boolean
}

/**
 * Variables for query customers
 */
export interface ICustomersQueryVariables {
  sortBy: string
}

/**
 * Variables for mutation createOrUpdateCustomer
 */
export interface ICreateOrUpdateCustomerVariables {
  customer: ICustomer
  update: boolean
}

/**
 * Variables for mutation createOrUpdateCustomer
 */
export interface IDeleteCustomerVariables {
  key: string
}
