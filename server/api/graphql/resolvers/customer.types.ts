import 'reflect-metadata'
import { ObjectType, Field } from 'type-graphql'

@ObjectType({ description: 'The Customer model' })
export class Customer {
  @Field() 
  key: string

  @Field() 
  name: string

  @Field() 
  description: string

  @Field() 
  webLink: string

  @Field() 
  externalSystemURL: string

  @Field() 
  icon: string

  @Field() 
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
  customer: Customer
  update: boolean
}

/**
 * Variables for mutation createOrUpdateCustomer
 */
export interface IDeleteCustomerVariables {
  key: string
}
