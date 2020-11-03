/**
 * Variables for query customers
 */
export interface ICustomersQueryVariables {
  sortBy: string;
}

/**
 * Variables for mutation createOrUpdateCustomer
 */
export interface ICreateOrUpdateCustomerVariables {
  customer: any;
  update: boolean;
}

/**
 * Variables for mutation createOrUpdateCustomer
 */
export interface IDeleteCustomerVariables {
  key: string;
}
