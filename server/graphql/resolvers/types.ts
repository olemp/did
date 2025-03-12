/* eslint-disable max-classes-per-file */
import 'reflect-metadata'
import { Field, ObjectType } from 'type-graphql'

@ObjectType({ description: 'A type that describes a Error' })
export class Error {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  message?: string

  @Field({ nullable: true })
  code?: string

  @Field({ nullable: true })
  statusCode?: string
}

@ObjectType({ description: 'A type that describes a BaseResult' })
export class BaseResult {
  @Field({ nullable: true, defaultValue: false })
  success: boolean

  @Field(() => Error, { nullable: true })
  error?: Error
}

@ObjectType({ description: 'A type that describes a EventError' })
export class EventError {
  @Field()
  code: string
}

export * from './apiToken/types'
export * from './customer/types'
export * from './label/types'
export * from './notification/types'
export * from './outlookCategory/types'
export * from './project/types'
export * from './reportLink/types'
export * from './reports/types'
export * from './role/types'
export * from './subscription/types'
export * from './timesheet/types'
export * from './user/types'
