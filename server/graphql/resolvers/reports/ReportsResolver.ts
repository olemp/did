import 'reflect-metadata'
import { Arg, Authorized, Ctx, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { PermissionScope } from '../../../../shared/config/security'
import { ReportService } from '../../../services'
import { IAuthOptions } from '../../authChecker'
import { RequestContext } from '../../requestContext'
import { TimesheetPeriodObject } from '../timesheet'
import {
  ConfirmedPeriodsQuery,
  ReportsQuery,
  ReportsQueryPreset,
  TimeEntry
} from './types'

/**
 * Resolver for `TimeEntry`.
 *
 * `ReportsService` are injected through
 * _dependendy injection_.
 *
 * @see https://typegraphql.com/docs/dependency-injection.html
 *
 * @category GraphQL Resolver
 */
@Service()
@Resolver(TimeEntry)
export class ReportsResolver {
  /**
   * Constructor for ReportsResolver
   *
   * @param _report - Report service
   */
  // eslint-disable-next-line unicorn/empty-brace-spaces
  constructor(private readonly _report: ReportService) {}

  /**
   * Get report
   *
   * @remarks Temporarily removed auth options. See discussion #969
   * and issue #967.
   *
   * @param preset - Query
   * @param query - Query
   * @param sortAsc - Sort ascending
   */
  @Query(() => [TimeEntry], {
    description: 'Get a preset report, or use custom filters.'
  })
  async report(
    @Arg('preset', { nullable: true }) preset?: ReportsQueryPreset,
    @Arg('query', { nullable: true }) query?: ReportsQuery,
    @Arg('sortAsc', { nullable: true }) sortAsc?: boolean
  ): Promise<TimeEntry[]> {
    return await this._report.getReport(preset, query, sortAsc)
  }

  /**
   * Get confirmed periods matching the specified queries
   */
  @Authorized<IAuthOptions>({ scope: PermissionScope.ACCESS_REPORTS })
  @Query(() => [TimesheetPeriodObject], {
    description: 'Get confirmed periods matching the specified queries.'
  })
  async confirmedPeriods(
    @Arg('queries', () => [ConfirmedPeriodsQuery])
    queries: ConfirmedPeriodsQuery[]
  ): Promise<TimesheetPeriodObject[]> {
    return await this._report.getConfirmedPeriods(queries)
  }

  /**
   * Get forecast report
   */
  @Authorized<IAuthOptions>({ scope: PermissionScope.ACCESS_REPORTS })
  @Query(() => [TimeEntry], {
    description: 'Get forecast report using custom filters.'
  })
  async forecastedReport(): Promise<TimeEntry[]> {
    return await this._report.getForecastReport()
  }

  /**
   * Get report
   *
   * @param preset - Report preset
   * @param context - GraphQL context
   */
  @Authorized<IAuthOptions>({ requiresUserContext: true })
  @Query(() => [TimeEntry], {
    description: 'Get a user preset report.'
  })
  async userReport(
    @Arg('preset') preset?: ReportsQueryPreset,
    @Ctx() context?: RequestContext
  ) {
    return await this._report.getUserReport(preset, context.userId)
  }
}
