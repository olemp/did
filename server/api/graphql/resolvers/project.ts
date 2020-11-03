import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { pick } from 'underscore'
import { IGraphQLContext } from '../IGraphQLContext'
import { BaseResult, Project, ProjectInput } from '../types'
import { connectEntities } from './project.utils'

@Resolver(Project)
export class ProjectResolver {
  /**
   * Get projects
   * 
   * @param {string} customerKey Customer key
   * @param {string} sortBy Sort by
   * @param {IGraphQLContext} ctx GraphQL context
   */
  @Query(() => [Project])
  async projects(
    @Arg('customerKey', { nullable: true }) customerKey: string,
    @Arg('sortBy', { nullable: true }) sortBy: string,
    @Ctx() ctx: IGraphQLContext
  ) {
    // eslint-disable-next-line prefer-const
    let [projects, customers, labels] = await Promise.all([
      ctx.services.azstorage.getProjects(customerKey, {
        sortBy,
      }),
      ctx.services.azstorage.getCustomers(),
      ctx.services.azstorage.getLabels(),
    ])
    projects = connectEntities(projects, customers, labels)
    return projects
  }

  /**
   * Create or update project
   * 
   * @param {ProjectInput} project Project
   * @param {boolean} update Update
   * @param {IGraphQLContext} ctx GraphQL context
   */
  @Mutation(() => BaseResult)
  async createOrUpdateProject(
    @Arg('project', () => ProjectInput) project: ProjectInput,
    @Arg('update') update: boolean,
    @Ctx() ctx: IGraphQLContext
  ) {
    try {
      const id = await ctx.services.azstorage.createOrUpdateProject(project, ctx.user.id, update)
      if (project.createOutlookCategory) {
        await ctx.services.msgraph.createOutlookCategory(id)
      }
      return { success: true, error: null }
    } catch (error) {
      return {
        success: false,
        error: pick(error, 'name', 'message', 'code', 'statusCode'),
      }
    }
  }
}

export * from './project.types'
