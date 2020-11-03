import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { pick } from 'underscore'
import { IGraphQLContext } from '../IGraphQLContext'
import { BaseResult } from '../types'
import { Role, RoleInput } from './role.types'

@Resolver(Role)
export class RoleResolver {
  /**
   * Get roles
   * 
   * @param {IGraphQLContext} ctx GraphQL context
   */
  @Query(() => [Role])
  async roles(@Ctx() ctx: IGraphQLContext) {
    return await ctx.services.azstorage.getRoles()
  }

  /**
   * Add or update role
   * 
   * @param {RoleInput} role Role
   * @param {boolean} update Update
   * @param {IGraphQLContext} ctx GraphQL context
   */
  @Mutation(() => BaseResult)
  async addOrUpdateRole(
    @Arg('role', () => RoleInput) role: RoleInput,
    @Arg('update') update: boolean,
    @Ctx() ctx: IGraphQLContext
  ) {
    try {
      await ctx.services.azstorage.addOrUpdateRole(role, update)
      return { success: true, error: null }
    } catch (error) {
      return {
        success: false,
        error: pick(error, 'name', 'message', 'code', 'statusCode'),
      }
    }
  }
}

export * from './role.types'
