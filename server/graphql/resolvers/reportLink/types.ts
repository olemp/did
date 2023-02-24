/* eslint-disable max-classes-per-file */
import 'reflect-metadata'
import { Field, InputType, ObjectType } from 'type-graphql'

/**
 * Input object for ReportLink used in GraphQL mutation `addOrUpdateReportLink`
 * 
 * @category GraphQL InputType
 */
@InputType({
  description: 'Input object for ReportLink used in GraphQL mutation addOrUpdateReportLink'
})
export class ReportLinkInput {
  @Field()
  name: string

  @Field({ nullable: true, defaultValue: '' })
  description: string

  @Field()
  externalUrl: string

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
