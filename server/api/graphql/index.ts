
// eslint-disable-next-line @typescript-eslint/no-var-requires
const log = require('debug')('api/graphql')
import { ApolloServer } from 'apollo-server-express'
import get from 'get-value'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { AzStorageService, MSGraphService, SubscriptionService } from '../../services'
import { IGraphQLContext } from './IGraphQLContext'
import * as resolvers from './resolvers'
import express from 'express'

/**
 * Get schema
 */
const getSchema = async () => {
  const schema = await buildSchema({
    resolvers: [
      resolvers.ApiTokenResolver,
      resolvers.CustomerResolver,
      resolvers.NotificationResolver,
      resolvers.OutlookCategoryResolver,
      resolvers.ProjectResolver,
      resolvers.RoleResolver,
      resolvers.TimeEntryResolver,
      resolvers.LabelResolver,
      resolvers.TimesheetResolver,
      resolvers.UserResolver
    ],
    emitSchemaFile: true,
    validate: false,
  })
  return schema
}



const createContext = async ({ req }): Promise<IGraphQLContext> => {
  try {
    let subscription = req.user && req.user.subscription
    if (!!req.token) {
      subscription = await new SubscriptionService().findSubscriptionWithToken(req.token)
      // eslint-disable-next-line quotes
      if (!subscription) throw new Error("You don't have access to this resource.")
    } else if (!req.user) throw new Error()
    const services = {
      azstorage: new AzStorageService(subscription),
      subscription: new SubscriptionService(),
      msgraph: !!req.user && new MSGraphService().init(req),
    }
    return {
      services,
      user: req.user || {},
      subscription,
    }
  } catch (e) {
    throw new Error()
  }
}
export default async (app: express.Application) => {
  try {
    const schema = await getSchema()
    const server = new ApolloServer({
      schema,
      rootValue: global,
      playground: false,
      context: createContext,
      engine: {
        reportSchema: true,
        generateClientInfo: ({ context }) => {
          return {
            clientName: get(context, 'subscription.name', { default: '' }),
          }
        },
      },
    })
    server.applyMiddleware({ app, path: '/graphql' })
  } catch (error) {
    log(error)
  }
}
