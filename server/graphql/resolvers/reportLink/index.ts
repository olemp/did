/* eslint-disable @typescript-eslint/no-unused-vars */
import 'reflect-metadata'
import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { ReportLinkService } from '../../../services/mongo'
import { IAuthOptions } from '../../authChecker'
import { BaseResult } from '../types'
import { ReportLink, ReportLinkInput } from './types'

/**
 * Resolver for `ReportLink`.
 *
 * `ReportLinkService` are injected through
 * _dependendy injection_.
 *
 * @see https://typegraphql.com/docs/dependency-injection.html
 *
 * @category GraphQL Resolver
 */
@Service()
@Resolver(ReportLink)
export class ReportLinkResolver {
  /**
   * Constructor for ReportLinkResolver
   *
   * @param _reportLinks - Label service
   */
  constructor(private readonly _reportLinks: ReportLinkService) {}

  /**
   * Get report links
   */
  @Authorized()
  @Query(() => [ReportLink], { description: 'Get report links' })
  reportLinks() {
    return this._reportLinks.getReportLinks()
  }

  /**
   * Add or update report link
   *
   * @param reportLink - Report link
   * @param update - Update flag
   */
  @Authorized<IAuthOptions>({ userContext: true })
  @Mutation(() => BaseResult, { description: 'Add or update report link' })
  async addOrUpdateReportLink(
    @Arg('reportLink', () => ReportLinkInput) reportLink: ReportLinkInput,
    @Arg('update', { nullable: true }) update: boolean
  ): Promise<BaseResult> {
    const r = new ReportLink(reportLink)
    await (update ? this._reportLinks.updateReportLink(r) : this._reportLinks.addReportLink(r))
    return { success: true, error: null }
  }
}

export * from './types'
