/* eslint-disable max-classes-per-file */
import 'reflect-metadata'
import { Field, InputType, ObjectType } from 'type-graphql'

/**
 * Input object for ReportLink used in GraphQL mutation `addOrUpdateReportLink`
 *
 * @category GraphQL InputType
 */
@InputType({
  description:
    'Input object for ReportLink used in GraphQL mutation addOrUpdateReportLink'
})
export class ReportLinkInput {
  @Field()
  name: string

  @Field({ nullable: true, defaultValue: '' })
  description: string

  @Field()
  externalUrl: string

  @Field({ nullable: true, defaultValue: null })
  year: number

  /**
   * Zero-indexed month number
   */
  @Field({ nullable: true, defaultValue: null })
  month: number

  @Field({ nullable: true, defaultValue: null })
  published?: boolean
}

/**
 * @category GraphQL InputType
 */
@InputType({ description: 'Input object for ReportLink query' })
export class ReportLinkQuery {
  @Field({ nullable: true })
  published?: boolean
}

/**
 * A type that describes a ReportLink
 *
 * @category GraphQL ObjectType
 */
@ObjectType({
  description: 'A type that describes a ReportLink',
  simpleResolvers: true
})
export class ReportLink {
  _id: string

  @Field()
  name: string

  @Field({ nullable: true, defaultValue: '' })
  description: string

  /**
   * External URL to the report (e.g. Google Drive, Sharepoint, etc.)
   */
  @Field()
  externalUrl: string

  /**
   * Date when the report was created
   */
  @Field()
  createdAt: Date

  /**
   * Date when the report was last updated
   */
  @Field()
  updatedAt: Date

  /**
   * User display name for the user who created the report
   */
  @Field({ nullable: true, defaultValue: null })
  createdBy: string

  /**
   * User display name for the user who last updated the report
   */
  @Field({ nullable: true, defaultValue: null })
  updatedBy: string

  /**
   * Year number for the report in format `YYYY`
   */
  @Field({ nullable: true, defaultValue: null })
  year: number

  /**
   * Zero-indexed month number
   */
  @Field({ nullable: true, defaultValue: null })
  month: number

  /**
   * Link reference. The format is `YYYY_MM` where January is `1` (not zero-indexed)
   */
  @Field({ nullable: true, defaultValue: null })
  get linkRef(): string {
    return [this.year, this.month + 1].filter(Boolean).join('_')
  }

  /**
   * Whether the report is published or not (`true` or `false`)
   */
  @Field({ nullable: true, defaultValue: null })
  published?: boolean

  /**
   * Constructs a new ReportLink
   *
   * @param input - Input
   */
  constructor(input?: ReportLinkInput) {
    Object.assign(this, input || {})
  }
}
