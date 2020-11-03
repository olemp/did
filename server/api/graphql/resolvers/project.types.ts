/* eslint-disable max-classes-per-file */
import 'reflect-metadata'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { Customer } from './customer.types'
import { LabelObject } from './label.types'
import { OutlookCategory } from './outlookCategory'

@ObjectType({ description: 'A type that describes a Project' })
export class Project {
  @Field(() => ID)
  id?: string

  @Field()
  key: string

  @Field()
  customerKey: string

  @Field()
  name: string

  @Field({ nullable: true, defaultValue: '' })
  description: string

  @Field({ nullable: true, defaultValue: null })
  icon: string

  @Field({ nullable: true, defaultValue: null })
  webLink?: string

  @Field({ nullable: true, defaultValue: null })
  externalSystemURL?: string

  @Field(() => Customer)
  customer?: Customer

  @Field({ nullable: true, defaultValue: null })
  outlookCategory?: OutlookCategory

  @Field({ nullable: true, defaultValue: false })
  inactive?: boolean

  @Field(() => [LabelObject])
  labels?: LabelObject[]
}

@InputType({ description: 'Input object for Project used in Mutation createOrUpdateProject' })
export class ProjectInput {
  @Field()
  id?: string

  @Field()
  key: string

  @Field()
  customerKey: string

  @Field()
  name: string

  @Field()
  description: string

  @Field()
  icon: string

  @Field()
  webLink?: string

  @Field()
  externalSystemURL?: string

  @Field()
  inactive?: boolean

  @Field(() => [String])
  labels?: string[]

  @Field()
  createOutlookCategory?: boolean
}