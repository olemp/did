/* eslint-disable max-classes-per-file */
import 'reflect-metadata'
import { Field, ObjectType } from 'type-graphql'

@ObjectType({ description: 'A type that describes a OutlookCategory' })
export class OutlookCategory {
  @Field() 
  id: string

  @Field() 
  displayName: string

  @Field() 
  color: string
}