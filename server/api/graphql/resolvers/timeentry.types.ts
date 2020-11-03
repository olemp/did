/* eslint-disable max-classes-per-file */
import 'reflect-metadata'
import { Field, InputType, ObjectType } from 'type-graphql'
import { EventError, Project } from '../types'
import { Customer } from './customer.types'
import { LabelObject } from './label.types'

@ObjectType({description: 'A type that describes a TimeEntry'})
export class TimeEntry {
  @Field()
  id: string

  @Field()
  key: string
  
  @Field()
  title: string
  
  @Field()
  isOrganizer: boolean
  
  @Field(() => Project)
  project: Project
  
  @Field()
  suggestedProject: any
  
  @Field(() => Customer)
  customer: Customer
  
  @Field()
  projectKey: string
  
  @Field()
  customerKey: string
  
  @Field()
  webLink: string
  
  @Field()
  duration: number
  
  @Field()
  
  @Field()
  startDateTime: string
  
  @Field()
  endDateTime: string
  
  @Field()
  day: string
  
  @Field()
  manualMatch?: boolean
  
  @Field()
  isSystemIgnored?: boolean
  
  @Field(() => EventError)
  error?: EventError
  
  @Field(() => [LabelObject])
  labels?: LabelObject[]
}

@InputType({})
export class TimeEntriesQuery {
  @Field()
  startDateTime?: string

  @Field()
  endDateTime?: string
  
  @Field()
  projectId?: string
  
  @Field()
  resourceId?: string
  
  @Field()
  weekNumber?: number
  
  @Field()
  monthNumber?: number
  
  @Field()
  startMonthIndex?: number
  
  @Field()
  endMonthIndex?: number
  
  @Field()
  year?: number
}
