/* eslint-disable unicorn/prevent-abbreviations */
import { MongoClient } from 'mongodb'
import { VerifyCallback } from 'passport-azure-ad'
import { Profile } from 'passport-google-oauth20'
import _ from 'underscore'
import { SubscriptionService, UserService } from '../../../services/mongo'
import { environment } from '../../../utils'
import { TENANT_NOT_ENROLLED } from '../errors/TENANT_NOT_ENROLLED'
import { USER_NOT_ENROLLED } from '../errors/USER_NOT_ENROLLED'

/**
 * On verify sign for Google accounts
 *
 * @param mcl - Mongo client
 * @param tokenParams - Token parameters
 * @param profile - User profile object
 * @param done - Done callback
 */
export const onVerifySignin = async (
  mcl: MongoClient,
  tokenParams: any,
  profile: Profile,
  done: VerifyCallback
) => {
  try {
    const mail = _.first(profile.emails)
    const id = mail?.value || profile.id
    const subSrv = new SubscriptionService({
      db: mcl.db(environment('MONGO_DB_DB_NAME'))
    })
    const subscription = await subSrv.getByExternalId(id, 'google')
    if (!subscription) throw TENANT_NOT_ENROLLED

    const userSrv = new UserService({
      db: mcl.db(subscription.db)
    })

    const user: any = await userSrv.getById(id)
    if (!user) throw USER_NOT_ENROLLED
    user.subscription = subscription
    user.tokenParams = tokenParams
    done(null, user)
  } catch (error) {
    done(error, null)
  }
}
