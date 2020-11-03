import { Arg, Ctx, Query, Resolver } from 'type-graphql'
import { find, first } from 'underscore'
import { IGraphQLContext } from '../IGraphQLContext'
import { TimeEntriesQuery, TimeEntry } from './timeentry.types'

@Resolver(TimeEntry)
export class TimeEntryResolver {
  /**
   * Get time entries
   * 
   * @param {boolean} currentUser Current user
   * @param {boolean} sortAsc Sort ascending
   * @param {boolean} forecast Forecast
   * @param {TimeEntriesQuery} query Query
   * @param {IGraphQLContext} ctx GraphQL context
   */
  @Query(() => [TimeEntry])
  async timeentries(
    @Arg('currentUser') currentUser: boolean,
    @Arg('sortAsc') sortAsc: boolean,
    @Arg('forecast') forecast: boolean,
    @Arg('query') query: TimeEntriesQuery,
    @Ctx() ctx: IGraphQLContext
  ) {
    if (currentUser) query.resourceId = ctx.user.id
    const [users, projects, customers, timeentries] = await Promise.all([
      ctx.services.azstorage.getUsers(),
      ctx.services.azstorage.getProjects(),
      ctx.services.azstorage.getCustomers(),
      ctx.services.azstorage.getTimeEntries(
        query,
        { sortAsc, forecast }
      ),
    ])
    const entries = timeentries.map(entry => {
      let project: any
      let customer: any
      const resource = find(users, user => user.id === entry.resourceId)
      if (!!entry.projectId) {
        project = find(projects, p => p.id === entry.projectId)
        customer = find(customers, c => c.key === first(entry.projectId.split(' ')))
      }
      return {
        ...entry,
        project,
        customer,
        resource,
      }
    })
    return entries
  }
}

export * from './timeentry.types'
