import jwt from 'jsonwebtoken'
import 'reflect-metadata'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { pick } from 'underscore'
import env from '../../../utils/env'
import { IGraphQLContext } from '../IGraphQLContext'
import { BaseResult } from '../types'
import { ApiToken } from './apiToken.types'

@Resolver(ApiToken)
export class ApiTokenResolver {
  /**
   * Get API tokens
   *
   * @param {IGraphQLContext} ctx GraphQL context
   */
  @Query(() => [ApiToken])
  async apiTokens(@Ctx() ctx: IGraphQLContext) {
    const tokens = await ctx.services.subscription.getApiTokens(ctx.user.subscription.id)
    return tokens
  }

  /**
   * Delete API tokens
   *
   * @param {string} name Name    *
   * @param {IGraphQLContext} ctx GraphQL context
   */
  @Mutation(() => String)
  async addApiToken(@Arg('name') name: string, @Ctx() ctx: IGraphQLContext) {
    const token = jwt.sign(
      {
        data: pick(ctx.user, 'id'),
      },
      env('API_TOKEN_SECRET')
    )
    const entry = await ctx.services.subscription.addApiToken(name, ctx.user.subscription.id, token)
    return entry ? token : null
  }

  /**
   * Delete API tokens
   *
   * @param {string} name Name
   * @param {IGraphQLContext} ctx GraphQL context
   */
  @Mutation(() => BaseResult)
  async deleteApiToken(@Arg('name') name: string, @Ctx() ctx: IGraphQLContext) {
    await ctx.services.subscription.deleteApiToken(name, ctx.user.subscription.id)
    return { success: true, error: null }
  }
  catch(error) {
    return {
      success: false,
      error: pick(error, 'name', 'message', 'code', 'statusCode'),
    }
  }
}

export * from './apiToken.types'
