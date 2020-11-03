import { pick, find, filter } from 'underscore'
import { gql } from 'apollo-server-express'
import { IGraphQLContext } from '../IGraphQLContext'
import { IAddOrUpdateUserVariables, IBulkAddUsersVariables, IUsersQueryVariables } from './user.types'

export const typeDef = gql`
  """
  A type that describes a Subscription
  """
  type Subscription {
    id: String!
    name: String!
  }

  """
  A type that describes a User
  """
  type User {
    id: String
    displayName: String
    givenName: String
    surname: String
    jobTitle: String
    mobilePhone: String
    mail: String
    preferredLanguage: String
    subscription: Subscription
    role: Role
  }

  """
  Input object for User used in Mutation addOrUpdateUser
  """
  input UserInput {
    id: String!
    displayName: String
    givenName: String
    surname: String
    jobTitle: String
    mobilePhone: String
    mail: String
    preferredLanguage: String
    role: String
  }

  extend type Query {
    """
    Get all users from Active Directory
    """
    adUsers: [User!]!

    """
    Get all users
    """
    users: [User!]!

    """
    Get the currently logged in user
    """
    currentUser: User
  }

  extend type Mutation {
    """
    Add or update user
    """
    addOrUpdateUser(user: UserInput!, update: Boolean): BaseResult!

    """
    Bulk add users
    """
    bulkAddUsers(users: [UserInput]!): BaseResult!
  }
`

/**
 * Get AD users
 *
 * @param {any} _obj {}
 * @param {any} _variables Variables
 * @param {IGraphQLContext} ctx GraphQL context
 */
async function adUsers(_obj: any, _variables: any, ctx: IGraphQLContext) {
  const users = await ctx.services.msgraph.getUsers()
  return users
}

/**
 * Get users
 *
 * @param {any} _obj {}
 * @param {IUsersQueryVariables} _variables Variables
 * @param {IGraphQLContext} ctx GraphQL context
 */
async function users(_obj: any, _variables: IUsersQueryVariables, ctx: IGraphQLContext) {
  // eslint-disable-next-line prefer-const
  let [users, roles] = await Promise.all([ctx.services.azstorage.getUsers(), ctx.services.azstorage.getRoles()])
  users = filter(
    users.map(user => ({
      ...user,
      role: find(roles, role => role.name === user.role),
    })),
    user => !!user.role
  )
  return users
}

/**
 * Get current user
 *
 * @param {any} _obj {}
 * @param {any} _variables Variables
 * @param {IGraphQLContext} ctx GraphQL context
 */
async function currentUser(_obj: any, _variables: any, ctx: IGraphQLContext) {
  if (!ctx.user) return null
  try {
    const [user, roles] = await Promise.all([
      ctx.services.azstorage.getUser(ctx.user.id),
      ctx.services.azstorage.getRoles(),
    ])
    return {
      ...ctx.user,
      ...user,
      role: find(roles, role => role.name === user.role),
    }
  } catch (error) {
    return null
  }
}

/**
 * Add or update user
 *
 * @param {any} _obj {}
 * @param {IAddOrUpdateUserVariables} variables Variables
 * @param {IGraphQLContext} ctx GraphQL context
 */
async function addOrUpdateUser(_obj: any, variables: IAddOrUpdateUserVariables, ctx: IGraphQLContext) {
  try {
    await ctx.services.azstorage.addOrUpdateUser(variables.user, variables.update)
    return { success: true, error: null }
  } catch (error) {
    return {
      success: false,
      error: pick(error, 'name', 'message', 'code', 'statusCode'),
    }
  }
}

/**
 * Add or update user
 *
 * @param {any} _obj {}
 * @param {IBulkAddUsersVariables} variables Variables
 * @param {IGraphQLContext} ctx GraphQL context
 */
async function bulkAddUsers(_obj: any, variables: IBulkAddUsersVariables, ctx: IGraphQLContext) {
  try {
    await ctx.services.azstorage.bulkAddUsers(variables.users)
    return { success: true, error: null }
  } catch (error) {
    return {
      success: false,
      error: pick(error, 'name', 'message', 'code', 'statusCode'),
    }
  }
}

export const resolvers = {
  Query: { adUsers, users, currentUser },
  Mutation: { bulkAddUsers, addOrUpdateUser },
}

export * from './user.types'
