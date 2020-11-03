import { pick } from 'underscore'
import jwt from 'jsonwebtoken'
import { gql } from 'apollo-server-express'
import env from '../../../utils/env'
import { IGraphQLContext } from '../IGraphQLContext'
import { IAddApiTokenVariables, IDeleteApiTokenVariables } from './apiToken.types'

export const typeDef = gql`
  """
  A type that describes a ApiToken
  """
  type ApiToken {
    name: String
    timestamp: String
  }

  extend type Query {
    """
    Get all API tokens for the subscription
    """
    apiTokens: [ApiToken!]!
  }

  extend type Mutation {
    """
    Add API token with the specified name
    """
    addApiToken(name: String!): String

    """
    Delete the API token with the specified name
    """
    deleteApiToken(name: String): BaseResult
  }
`

/**
 * Get API tokens
 * 
 * @param {any} _obj {}
 * @param {any} _variables {}
 * @param {IGraphQLContext} ctx GraphQL context
 */
async function apiTokens(_obj: any, _variables: any, ctx: IGraphQLContext) {
  const tokens = await ctx.services.subscription.getApiTokens(ctx.user.subscription.id)
  return tokens
}

/**
 * Add API tokens
 * 
 * @param {any} _obj {}
 * @param {IAddApiTokenVariables} variables Variables
 * @param {IGraphQLContext} ctx GraphQL context
 */
async function addApiToken(_obj: any, variables: IAddApiTokenVariables, ctx: IGraphQLContext) {
  const token = jwt.sign(
    {
      data: pick(ctx.user, 'id'),
    },
    env('API_TOKEN_SECRET')
  )
  const entry = await ctx.services.subscription.addApiToken(variables.name, ctx.user.subscription.id, token)
  return entry ? token : null
}

/**
 * Delete API tokens
 * 
 * @param {any} _obj {}
 * @param {IDeleteApiTokenVariables} variables Variables
 * @param {IGraphQLContext} ctx GraphQL context
 */
async function deleteApiToken(_obj: any, variables: IDeleteApiTokenVariables, ctx: IGraphQLContext) {
  try {
    await ctx.services.subscription.deleteApiToken(variables.name, ctx.user.subscription.id)
    return { success: true, error: null }
  } catch (error) {
    return {
      success: false,
      error: pick(error, 'name', 'message', 'code', 'statusCode'),
    }
  }
}

export const resolvers = {
  Query: { apiTokens },
  Mutation: { addApiToken, deleteApiToken },
}

export * from './apiToken.types'