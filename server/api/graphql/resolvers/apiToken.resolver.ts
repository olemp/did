import jwt from 'jsonwebtoken'
import 'reflect-metadata'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { pick } from 'underscore'
import env from '../../../utils/env'
import { SubscriptionService } from '../../services'
import { IAuthOptions } from '../authChecker'
import { Context } from '../context'
import { ApiToken } from './apiToken.types'
import { BaseResult } from './types'

@Service()
@Resolver(ApiToken)
export class ApiTokenResolver {
  /**
   * Constructor for ApiTokenResolver
   *
   * AzStorageService is automatically injected using Container from typedi
   *
   * @param {SubscriptionService} _subscription SubscriptionService
   */
  constructor(private readonly _subscription: SubscriptionService) {}

  /**
   * Get API tokens
   *
   * @param {Context} ctx GraphQL context
   */
  @Authorized<IAuthOptions>({ userContext: true })
  @Query(() => [ApiToken], { description: 'Get API tokens' })
  async apiTokens(@Ctx() ctx: Context): Promise<ApiToken[]> {
    const tokens = await this._subscription.getApiTokens(ctx.user.subscription.id)
    return tokens
  }

  /**
   * Add API token
   *
   * @param {string} name Name    *
   * @param {Context} ctx GraphQL context
   */
  @Authorized<IAuthOptions>({ userContext: true })
  @Mutation(() => String, { description: 'Add API token' })
  async addApiToken(@Arg('name') name: string, @Ctx() ctx: Context): Promise<string> {
    const token = jwt.sign(
      {
        data: pick(ctx.user, 'id')
      },
      env('API_TOKEN_SECRET')
    )
    const entry = await this._subscription.addApiToken(name, ctx.user.subscription.id, token)
    return entry ? token : null
  }

  /**
   * Delete API token
   *
   * @param {string} name Name
   * @param {Context} ctx GraphQL context
   */
  @Authorized<IAuthOptions>({ userContext: true })
  @Mutation(() => BaseResult, { description: 'Delete API tokens' })
  async deleteApiToken(@Arg('name') name: string, @Ctx() ctx: Context): Promise<BaseResult> {
    try {
      await this._subscription.deleteApiToken(name, ctx.user.subscription.id)
      return { success: true, error: null }
    } catch (error) {
      return {
        success: false,
        error: pick(error, 'name', 'message', 'code', 'statusCode')
      }
    }
  }
}
