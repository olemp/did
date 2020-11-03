import createDebug from 'debug'
const debug = createDebug('middleware/passport/onVerifySignin')
import SubscriptionService from '../../services/subscription'
import AzStorageService from '../../services/azstorage'
import { NO_OID_FOUND, TENANT_NOT_ENROLLED, USER_NOT_ENROLLED } from './errors'

/**
 * On verify signin
 *
 * @param _iss
 * @param _sub
 * @param profile
 * @param _accessToken
 * @param _refreshToken
 * @param oauthToken
 * @param done
 */
export default async function (_iss, _sub, profile, _accessToken, _refreshToken, oauthToken, done) {
  if (!profile.oid) {
    debug('No oid found. Returning error NO_OID_FOUND.')
    return done(NO_OID_FOUND, null)
  }
  const subscription = await new SubscriptionService().getSubscription(profile._json.tid)
  if (!subscription) {
    debug('No subscription found for %s', profile._json.tid)
    return done(TENANT_NOT_ENROLLED, null)
  }
  debug('Subscription found for %s', profile._json.tid)
  const user = await new AzStorageService(subscription).getUser(profile.oid)
  if (!user) {
    debug('User %s is not registered for %s', profile.oid, subscription.name)
    return done(USER_NOT_ENROLLED, null)
  }
  user.subscription = subscription
  user.oauthToken = oauthToken
  return done(null, user)
}
