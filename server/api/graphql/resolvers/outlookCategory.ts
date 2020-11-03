/* eslint-disable max-classes-per-file */
import 'reflect-metadata'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { pick } from 'underscore'
import { IGraphQLContext } from '../IGraphQLContext'
import { BaseResult, OutlookCategory } from '../types'

@Resolver(OutlookCategory)
export class OutlookCategoryResolver {
  /**
   * Get Outlook categories
   * 
   * @param {IGraphQLContext} ctx GraphQL context
   */
  @Query(() => [OutlookCategory])
  async customers(@Ctx() ctx: IGraphQLContext) {
    const categories = await ctx.services.msgraph.getOutlookCategories()
    return categories.map(c => ({ ...c, key: c.id }))
  }

  /**
   * Create or update customer
   * 
   * @param {string} category Category
   * @param {IGraphQLContext} ctx GraphQL context
   */
  @Mutation(() => BaseResult)
  async createOutlookCategory(@Arg('category') category: string, @Ctx() ctx: IGraphQLContext) {
    try {
      await ctx.services.msgraph.createOutlookCategory(category)
      return { success: true, error: null }
    } catch (error) {
      return {
        success: false,
        error: pick(error, 'name', 'message', 'code', 'statusCode'),
      }
    }
  }
}

export * from './outlookCategory.types'
