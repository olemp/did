import { pick } from 'underscore'
import { gql } from 'apollo-server-express'
import { IGraphQLContext } from '../IGraphQLContext'

export const typeDef = gql`
  """
  A type that describes a Label
  """
  type Label {
    name: String!
    description: String
    color: String!
    icon: String
  }

  """
  Input object for Label used in Mutation addOrUpdateLabel
  """
  input LabelInput {
    name: String!
    description: String
    color: String!
    icon: String
  }

  extend type Query {
    """
    Get labels
    """
    labels: [Label!]!
  }

  extend type Mutation {
    """
    Add or update label
    """
    addOrUpdateLabel(label: LabelInput!, update: Boolean): BaseResult

    """
    Delete label
    """
    deleteLabel(name: String!): BaseResult
  }
`

/**
 * Get labels
 *
 * @param {any} _obj {}
 * @param {any} _variables Variables
 * @param {IGraphQLContext} ctx GraphQL context
 */
async function labels(_obj: any, _variables: any, ctx: IGraphQLContext) {
  const labels = await ctx.services.azstorage.getLabels()
  return labels
}

/**
 * Add or update label
 *
 * @param {any} _obj {}
 * @param {any} variables Variables
 * @param {IGraphQLContext} ctx GraphQL context
 */
async function addOrUpdateLabel(_obj: any, variables: any, ctx: IGraphQLContext) {
  try {
    await ctx.services.azstorage.addOrUpdateLabel(variables.label, ctx.user.id, variables.update)
    return { success: true, error: null }
  } catch (error) {
    return {
      success: false,
      error: pick(error, 'name', 'message', 'code', 'statusCode'),
    }
  }
}

/**
 * Delete label
 *
 * @param {any} _obj {}
 * @param {any} variables Variables
 * @param {IGraphQLContext} ctx GraphQL context
 */
async function deleteLabel(_obj: any, variables: any, ctx: IGraphQLContext) {
  try {
    await ctx.services.azstorage.deleteLabel(variables.name)
    return { success: true, error: null }
  } catch (error) {
    return {
      success: false,
      error: pick(error, 'name', 'message', 'code', 'statusCode'),
    }
  }
}

export const resolvers = {
  Query: { labels },
  Mutation: { addOrUpdateLabel, deleteLabel },
}
