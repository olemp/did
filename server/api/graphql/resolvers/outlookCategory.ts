import { pick } from 'underscore'
import { gql } from 'apollo-server-express'
import { IGraphQLContext } from '../IGraphQLContext'

export const typeDef = gql`
  """
  A type that describes a OutlookCategory
  """
  type OutlookCategory {
    id: String
    key: String
    displayName: String
    color: String
  }

  extend type Query {
    """
    Get Outlook categories
    """
    outlookCategories: [OutlookCategory!]!
  }

  extend type Mutation {
    """
    Create Outlook category
    """
    createOutlookCategory(category: String!): BaseResult!
  }
`

/**
 * Get Outlook categories
 *
 * @param {any} _obj {}
 * @param {any} variables Variables
 * @param {IGraphQLContext} ctx GraphQL context
 */
async function outlookCategories(_obj: any, _variables, ctx: IGraphQLContext) {
  const categories = await ctx.services.msgraph.getOutlookCategories()
  return categories.map(c => ({ ...c, key: c.id }))
}

/**
 * Create Outlook category
 *
 * @param {any} _obj {}
 * @param {any} variables Variables
 * @param {IGraphQLContext} ctx GraphQL context
 */
async function createOutlookCategory(_obj: any, variables: any, ctx: IGraphQLContext) {
  try {
    await ctx.services.msgraph.createOutlookCategory(variables.category)
    return { success: true, error: null }
  } catch (error) {
    return {
      success: false,
      error: pick(error, 'name', 'message', 'code', 'statusCode'),
    }
  }
}

export const resolvers = {
  Query: { outlookCategories },
  Mutation: { createOutlookCategory },
}
