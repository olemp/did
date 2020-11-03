import { ApolloServer } from 'apollo-server-express'
import get from 'get-value'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { AzStorageService, MSGraphService, SubscriptionService } from '../../services'
import { IGraphQLContext } from './IGraphQLContext'
import { CustomerResolver } from './resolvers/customer'
import { UserResolver } from './resolvers/user'

// const Query = gql`
//   """
//   A type that describes a Error
//   """
//   type Error {
//     name: String
//     message: String
//     code: String
//     statusCode: String
//   }

//   """
//   A type that describes a EventError
//   """
//   type EventError {
//     code: String
//   }

//   """
//   Result for Mutations
//   """
//   type BaseResult {
//     success: Boolean
//     error: Error
//     data: String
//   }

//   """
//   The Query type is a special type that defines the entry point of every
//   GraphQL query. Otherwise, the Query type is the same as any other
//   GraphQL object type, and its fields work exactly the same way.
//   """
//   type Query {
//     """
//     Query cannot be initialized empty
//     """
//     _: String
//   }

//   """
//   The Mutation type is a special type that is used to modify server-side data.
//   Just like in queries, if the mutation field returns an object type,
//   you can ask for nested fields. It can also contain multiple fields.
//   However, unlike queries, mutation fields run in series, one after the other.
//   """
//   type Mutation {
//     """
//     Mutation cannot be initialized empty
//     """
//     _: String
//   }
// `

/**
 * Get schema
 */
const getSchema = async () => {
  const schema = await buildSchema({
    resolvers: [CustomerResolver, UserResolver],
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
export default async (app) => {
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
    // eslint-disable-next-line no-console
    console.log(error)
  }
}
