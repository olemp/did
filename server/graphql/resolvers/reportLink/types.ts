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

  @Field()
  externalUrl: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field({ nullable: true, defaultValue: null })
  year: number

  /**
   * Zero-indexed month number
   */
  @Field({ nullable: true, defaultValue: null })
  month: number

  @Field({ nullable: true, defaultValue: null })
  get linkRef(): string {
    return [this.year, this.month].filter(Boolean).join('_')
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
