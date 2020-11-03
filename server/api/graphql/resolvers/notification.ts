import 'reflect-metadata'
import { Arg, Ctx, Query, Resolver } from 'type-graphql'
import { IGraphQLContext } from '../IGraphQLContext'
import forecast from './notification.forecast'
import { Notification, NotificationTemplates } from './notification.types'
import unconfirmedPeriods from './notification.unconfirmed-periods'

@Resolver(Notification)
export class NotificationResolver {
  /**
  * Get notifications
  *
  * @param {NotificationTemplates} templates Templates
  * @param {string} locale Locale
  * @param {IGraphQLContext} ctx GraphQL context
  */
  @Query(() => [Notification])
  async notifications(
    @Arg('templates', () => NotificationTemplates) templates: NotificationTemplates,
    @Arg('locale') locale: string,
    @Ctx() ctx: IGraphQLContext
  ) {
    if (!ctx.user.id) return { success: false, error: null }

    const notifications = await Promise.all([
      unconfirmedPeriods({
        template: templates.unconfirmedPeriods,
        ctx,
        locale,
      }),
      forecast({
        template: templates.forecast,
        ctx,
        locale,
      }),
    ])
    // eslint-disable-next-line prefer-spread
    return [].concat.apply([], notifications)
  }
}

export * from './notification.types'
