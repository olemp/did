/* eslint-disable max-classes-per-file */
import 'reflect-metadata'
import { Field, ObjectType } from 'type-graphql'

@ObjectType({ description: 'A type that describes a ApiToken' })
export class ApiToken {
    @Field()
    name: string

    @Field()
    timestamp: string
}
