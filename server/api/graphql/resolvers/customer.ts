import { gql } from 'apollo-server-express'
import 'reflect-metadata'
import { Query, Resolver } from 'type-graphql'
import { pick } from 'underscore'
import { IGraphQLContext } from '../IGraphQLContext'
import { Customer, ICreateOrUpdateCustomerVariables, ICustomersQueryVariables, IDeleteCustomerVariables } from './customer.types'
const AzTableUtilities = require('../../../utils/table').default
const { executeBatch, createAzBatch } = new AzTableUtilities()

export const typeDef = gql`
  """
  A type that describes a Customer
  """
  type Customer {
    key: String
    name: String
    description: String
    webLink: String
    externalSystemURL: String
    icon: String
    inactive: Boolean
  }

  """
  Input object for Customer used in Mutation createOrUpdateCustomer
  """
  input CustomerInput {
    key: String
    name: String
    description: String
    webLink: String
    externalSystemURL: String
    icon: String
    inactive: Boolean
  }

  extend type Query {
    """
    Get all API tokens for the subscription
    """
    customers(sortBy: String): [Customer!]!
  }

  extend type Mutation {
    """
    Create or update customer
    """
    createOrUpdateCustomer(customer: CustomerInput!, update: Boolean): BaseResult

    """
    Delete customer
    """
    deleteCustomer(key: String!): BaseResult
  }
`


/**
 * Get customers
 *
 * @param {any} _obj {}
 * @param {ICustomersQueryVariables} variables Variables
 * @param {IGraphQLContext} ctx GraphQL context
 */
async function customers(_obj: any, variables: ICustomersQueryVariables, ctx: IGraphQLContext) {
  return await ctx.services.azstorage.getCustomers({ sortBy: variables.sortBy })
}

/**
 * Create or update customer
 *
 * @param {any} _obj {}
 * @param {ICreateOrUpdateCustomerVariables} variables Variables
 * @param {IGraphQLContext} ctx GraphQL context
 */
async function createOrUpdateCustomer(_obj: any, variables: ICreateOrUpdateCustomerVariables, ctx: IGraphQLContext) {
  try {
    await ctx.services.azstorage.createOrUpdateCustomer(variables.customer, ctx.user.id, variables.update)
    return { success: true, error: null }
  } catch (error) {
    return {
      success: false,
      error: pick(error, 'name', 'message', 'code', 'statusCode'),
    }
  }
}

/**
 * Delete customer
 *
 * @param {any} _obj {}
 * @param {IDeleteCustomerVariables} variables Variables
 * @param {IGraphQLContext} ctx GraphQL context
 */
async function deleteCustomer(_obj: any, variables: IDeleteCustomerVariables, ctx: IGraphQLContext) {
  try {
    const projects = await ctx.services.azstorage.getProjects(variables.key, {
      noParse: true,
    })
    if (projects.length > 0) {
      const batch = projects.reduce((b, entity) => {
        b.deleteEntity(entity)
        return b
      }, createAzBatch())
      await executeBatch('Projects', batch)
    }
    await ctx.services.azstorage.deleteCustomer(variables.key)
    return { success: true, error: null }
  } catch (error) {
    return {
      success: false,
      error: pick(error, 'name', 'message', 'code', 'statusCode'),
    }
  }
}

export const resolvers = {
  Query: { customers },
  Mutation: { createOrUpdateCustomer, deleteCustomer },
}

@Resolver(Customer)
export class CustomerResolver {
  @Query(() => [Customer])
  async customers(obj, variables, ctx) {
    return await ctx.services.azstorage.getCustomers({ sortBy: variables.sortBy })
  }
}

export * from './customer.types'
