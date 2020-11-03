/* eslint-disable max-classes-per-file */
import 'reflect-metadata'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { filter, find, pick } from 'underscore'
import { IGraphQLContext } from '../IGraphQLContext'
import { BaseResult } from '../types'
import { User, UserInput } from './user.types'


@Resolver(User)
export class UserResolver {
    /**
    * Get current user
    *
    * @param {IGraphQLContext} ctx GraphQL context
    */
    @Query(() => User)
    async currentUser(@Ctx() ctx: IGraphQLContext) {
        if (!ctx.user) return null
        try {
            const [user, roles] = await Promise.all([
                ctx.services.azstorage.getUser(ctx.user.id),
                ctx.services.azstorage.getRoles(),
            ])
            return {
                ...ctx.user,
                ...user,
                role: find(roles, role => role.name === user.role),
            }
        } catch (error) {
            return null
        }
    }

    /**
     * Get AD users
     *
     * @param {IGraphQLContext} ctx GraphQL context
     */
    @Query(() => [User])
    async adUsers(@Ctx() ctx: IGraphQLContext) {
        const users = await ctx.services.msgraph.getUsers()
        return users
    }

    /**
     * Get users
     *
     * @param {IGraphQLContext} ctx GraphQL context
     */
    @Query(() => [User])
    async users(@Ctx() ctx: IGraphQLContext) {
        // eslint-disable-next-line prefer-const
        let [users, roles] = await Promise.all([ctx.services.azstorage.getUsers(), ctx.services.azstorage.getRoles()])
        users = filter(
            users.map(user => ({
                ...user,
                role: find(roles, role => role.name === user.role),
            })),
            user => !!user.role
        )
        return users
    }

    /**
     * Add or update user
     *
     * @param {UserInput} user User
     * @param {boolean} update Update
     * @param {IGraphQLContext} ctx GraphQL context
     */
    @Mutation(() => BaseResult)
    async addOrUpdateUser(@Arg('user', () => UserInput) user: UserInput, @Arg('update') update: boolean, ctx: IGraphQLContext): Promise<BaseResult> {
        try {
            await ctx.services.azstorage.addOrUpdateUser(user, update)
            return { success: true, error: null }
        } catch (error) {
            return {
                success: false,
                error: pick(error, 'name', 'message', 'code', 'statusCode'),
            }
        }
    }

    /**
     * Bulk add users
     *
     * @param {UserInput[]} users Users
     * @param {IGraphQLContext} ctx GraphQL context
     */
    @Mutation(() => BaseResult)
    async bulkAddUsers(@Arg('users', () => [UserInput]) users: UserInput[], ctx: IGraphQLContext): Promise<BaseResult> {
        try {
            await ctx.services.azstorage.bulkAddUsers(users)
            return { success: true, error: null }
        } catch (error) {
            return {
                success: false,
                error: pick(error, 'name', 'message', 'code', 'statusCode'),
            }
        }
    }
}

export * from './user.types'
