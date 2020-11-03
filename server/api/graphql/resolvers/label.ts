import 'reflect-metadata'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { pick } from 'underscore'
import { IGraphQLContext } from '../IGraphQLContext'
import { BaseResult } from '../types'
import { LabelObject, LabelInput } from './label.types'

@Resolver(LabelObject)
export class LabelResolver {
  /**
   * Get labels
   * 
   * @param {IGraphQLContext} ctx GraphQL context
   */
  @Query(() => [LabelObject])
  async labels(@Ctx() ctx: IGraphQLContext) {
    return await ctx.services.azstorage.getLabels()
  }

  /**
   * Add or update label
   * 
   * @param {LabelInput} label Label
   * @param {boolean} update Update
   * @param {IGraphQLContext} ctx GraphQL context
   */
  @Mutation(() => BaseResult)
  async addOrUpdateLabel(
    @Arg('label', () => LabelInput) label: LabelInput,
    @Arg('update', { nullable: true }) update: boolean,
    @Ctx() ctx: IGraphQLContext
  ) {
    try {
      await ctx.services.azstorage.addOrUpdateLabel(label, ctx.user.id, update)
      return { success: true, error: null }
    } catch (error) {
      return {
        success: false,
        error: pick(error, 'name', 'message', 'code', 'statusCode'),
      }
    }
  }

  /**
   * Delete label
   * 
   * @param {string} name Name 
   * @param {IGraphQLContext} ctx GraphQL context
   */
  @Mutation(() => BaseResult)
  async deleteLabel(@Arg('name') name: string, @Ctx() ctx: IGraphQLContext) {
    try {
      await ctx.services.azstorage.deleteLabel(name)
      return { success: true, error: null }
    } catch (error) {
      return {
        success: false,
        error: pick(error, 'name', 'message', 'code', 'statusCode'),
      }
    }
  }
}

export * from './label.types'
