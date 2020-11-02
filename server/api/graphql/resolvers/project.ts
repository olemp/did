import { pick } from 'underscore'
import { connectEntities } from './project.utils'
import { gql } from 'apollo-server-express'
import { IGraphQLContext } from '../IGraphQLContext'

export const typeDef = gql`
  """
  A type that describes a Project
  """
  type Project {
    id: String
    key: String
    name: String
    description: String
    webLink: String
    externalSystemURL: String
    icon: String
    customerKey: String
    customer: Customer
    inactive: Boolean
    labels: [Label]
  }

  """
  Input object for Project used in Mutation createOrUpdateProject
  """
  input ProjectInput {
    key: String
    name: String
    description: String
    webLink: String
    externalSystemURL: String
    icon: String
    customerKey: String
    inactive: Boolean
    labels: [String]
    createOutlookCategory: Boolean
  }

  extend type Query {
    """
    Get projects
    """
    projects(customerKey: String, sortBy: String): [Project!]!
  }

  extend type Mutation {
    """
    Create or update project
    """
    createOrUpdateProject(project: ProjectInput!, update: Boolean): BaseResult
  }
`

/**
 * Create or update project
 *
 * @param {any} _obj {}
 * @param {any} variables Variables
 * @param {IGraphQLContext} ctx GraphQL context
 */
async function createOrUpdateProject(_obj: any, variables: any, ctx: IGraphQLContext) {
  try {
    const id = await ctx.services.azstorage.createOrUpdateProject(variables.project, ctx.user.id, variables.update)
    if (variables.project.createOutlookCategory) {
      await ctx.services.msgraph.createOutlookCategory(id)
    }
    return { success: true, error: null }
  } catch (error) {
    return {
      success: false,
      error: pick(error, 'name', 'message', 'code', 'statusCode'),
    }
  }
}

/**
 * Get projects
 *
 * @param {any} _obj {}
 * @param {any} variables Variables
 * @param {IGraphQLContext} ctx GraphQL context
 */
async function projects(_obj: any, variables: any, ctx: IGraphQLContext) {
  // eslint-disable-next-line prefer-const
  let [projects, customers, labels] = await Promise.all([
    ctx.services.azstorage.getProjects(variables.customerKey, {
      sortBy: variables.sortBy,
    }),
    ctx.services.azstorage.getCustomers(),
    ctx.services.azstorage.getLabels(),
  ])
  projects = connectEntities(projects, customers, labels)
  return projects
}

export const resolvers = {
  Query: { projects },
  Mutation: { createOrUpdateProject },
}
