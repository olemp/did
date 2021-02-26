import { omit } from 'underscore'
import { Context } from '../../graphql/context'
import { Subscription, SubscriptionSettings } from '../../graphql/resolvers/types'
import { MongoDocumentService } from './@document'

export class SubscriptionService extends MongoDocumentService<Subscription> {
  constructor(context: Context) {
    super(context, 'subscriptions')
  }

  /**
   * Replace id with _id
   *
   * @param {Subscription} subscription Subscription
   */
  private _replaceId<T>(subscription: Subscription): T {
    return ({ ...omit(subscription, 'id'), _id: subscription.id } as unknown) as T
  }

  /**
   * Get subscription by ID
   *
   * @param {string} id Subscription ID
   */
  public async getById(id: string): Promise<Subscription> {
    try {
      const subscription = await this.collection.findOne({ _id: id })
      return {
        ...subscription,
        id: subscription._id
      }
    } catch (err) {
      throw err
    }
  }

  /**
   * Add subscription
   *
   * @param {Subscription} subscription Subscription
   */
  public async addSubscription(subscription: Subscription) {
    try {
      const result = await this.collection.insertOne(this._replaceId(subscription))
      return result
    } catch (err) {
      throw err
    }
  }

  /**
   * Update subscription
   *
   * @param {SubscriptionSettings} settings Subscription settings
   */
  public async updateSubscription(settings: SubscriptionSettings) {
    try {
      const result = await this.collection.updateOne(
        { _id: this.context.subscription.id },
        { $set: { settings } }
      )
      return result
    } catch (err) {
      throw err
    }
  }
}
