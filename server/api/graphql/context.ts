
import { MSGraphService, AzStorageService, SubscriptionService } from '../../services'
import { Subscription, User } from './types'


export class Context {
  public services: {
    msgraph: MSGraphService;
    azstorage: AzStorageService;
    subscription: SubscriptionService;
  };
  public user: User;
  public subscription: Subscription;
}

/**
 * Create context
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createContext = async ({ req }): Promise<Context> => {
  try {
    let subscription = req.user && req.user.subscription
    if (!!req.token) {
      subscription = await new SubscriptionService().findSubscriptionWithToken(req.token)
      if (!subscription) {
        // eslint-disable-next-line quotes
        throw new Error("You don't have access to this resource.")
      }
    } else if (!req.user) {
      throw new Error()
    }
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
  } catch (error) {
    throw error
  }
}