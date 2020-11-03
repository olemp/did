/* eslint-disable max-classes-per-file */
import 'reflect-metadata'
import { ObjectType, InputType, Field } from 'type-graphql'

@ObjectType({ description: 'A type that describes a Customer' })
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

@InputType({ description: 'Input object for Customer used in Mutation createOrUpdateCustomer' })
export class CustomerInput {
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
