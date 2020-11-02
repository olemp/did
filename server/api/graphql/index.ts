import { ApolloServer, gql } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools'
import { typeDef as Customer } from './resolvers/customer'
import { typeDef as Project } from './resolvers/project'
import { typeDef as Timesheet } from './resolvers/timesheet'
import { typeDef as TimeEntry } from './resolvers/timeentry'
import { typeDef as OutlookCategory } from './resolvers/outlookCategory'
import { typeDef as User } from './resolvers/user'
import { typeDef as Label } from './resolvers/label'
import { typeDef as Role } from './resolvers/role'
import { typeDef as Notification } from './resolvers/notification'
import { typeDef as ApiToken } from './resolvers/apiToken'
import { MSGraphService, AzStorageService, SubscriptionService } from '../../services'
import resolvers from './resolvers'
import get from 'get-value'

const Query = gql`
  """
  A type that describes a Error
  """
  type Error {
    name: String
    message: String
    code: String
    statusCode: String
  }

  """
  A type that describes a EventError
  """
  type EventError {
    code: String
  }

  """
  Result for Mutations
  """
  type BaseResult {
    success: Boolean
    error: Error
    data: String
  }

  """
  The Query type is a special type that defines the entry point of every
  GraphQL query. Otherwise, the Query type is the same as any other
  GraphQL object type, and its fields work exactly the same way.
  """
  type Query {
    """
    Query cannot be initialized empty
    """
    _: String
  }

  """
  The Mutation type is a special type that is used to modify server-side data.
  Just like in queries, if the mutation field returns an object type,
  you can ask for nested fields. It can also contain multiple fields.
  However, unlike queries, mutation fields run in series, one after the other.
  """
  type Mutation {
    """
    Mutation cannot be initialized empty
    """
    _: String
  }
`

/**
 * Get schema
 */
const getSchema = () => {
  const typeDefs = [
    Query,
    Customer,
    Project,
    TimeEntry,
    Label,
    OutlookCategory,
    User,
    Role,
    ApiToken,
    Notification,
    Timesheet,
  ]
  return makeExecutableSchema({
    typeDefs,
    resolvers,
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
  })
}

const schema = getSchema()

const createContext = async ({ req }) => {
  try {
    let subscription = req.user && req.user.subscription
    if (!!req.token) {
      subscription = await SubscriptionService.findSubscriptionWithToken(req.token)
      if (!subscription) throw new Error('You don\'t have access to this resource.')
    } else if (!req.user) throw new Error()
    const services = {
      azstorage: new AzStorageService(subscription),
      subscription: SubscriptionService,
      msgraph: null,
    }
    if (!!req.user) services.msgraph = MSGraphService.init(req)
    return {
      services,
      user: req.user || {},
      subscription,
    }
  } catch (e) {
    return new Error()
  }
}

module.exports = new ApolloServer({
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
