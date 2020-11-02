import unconfirmedPeriods from './notification.unconfirmed-periods'
import forecast from './notification.forecast'
import { gql } from 'apollo-server-express'
import { IGraphQLContext } from '../IGraphQLContext'

export const typeDef = gql`
  """
  A type that describes a Notification
  """
  type Notification {
    id: String
    type: Int!
    severity: Int!
    text: String!
    moreLink: String
  }

  """
  Input object for Notification template used in Query notifications
  """
  input NotificationTemplates {
    unconfirmedPeriods: String!
    forecast: String!
  }

  extend type Query {
    """
    Get notifications
    """
    notifications(templates: NotificationTemplates!, locale: String!): [Notification!]!
  }
`

/**
 * Get notifications
 *
 * @param {any} _obj {}
 * @param {any} variables Variables
 * @param {IGraphQLContext} ctx GraphQL context
 */
async function notifications(_obj: any, variables: any, ctx: IGraphQLContext) {
  if (!ctx.user.id) return { success: false, error: null }

  const notifications = await Promise.all([
    unconfirmedPeriods({
      template: variables.templates.unconfirmedPeriods,
      ctx,
      locale: variables.locale,
    }),
    forecast({
      template: variables.templates.forecast,
      ctx,
      locale: variables.locale,
    }),
  ])
  // eslint-disable-next-line prefer-spread
  return [].concat.apply([], notifications)
}

export const resolvers = {
  Query: { notifications },
  Mutation: {},
}
