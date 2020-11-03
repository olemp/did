/* eslint-disable max-classes-per-file */
import 'reflect-metadata'
import { Field, ObjectType } from 'type-graphql'
import { Customer } from './customer.types'
import { LabelObject } from './label.types'
import { OutlookCategory } from './outlookCategory'

@ObjectType({ description: 'A type that describes a Project' })
export class Project {
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
  
  @Field(() => Customer)
  customer?: Customer
  
  @Field(() => OutlookCategory)
  outlookCategory?: OutlookCategory
  
  @Field()
  inactive?: boolean
  
  @Field(() => [LabelObject])
  labels?: LabelObject[]
}

@ObjectType({ description: 'Input object for Project used in Mutation createOrUpdateProject' })
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