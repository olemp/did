/* eslint-disable max-classes-per-file */
import 'reflect-metadata'
import { Field, InputType, ObjectType } from 'type-graphql'
import { Role } from './role.types'

@ObjectType({ description: 'A type that describes a Subscription' })
export class Subscription {
    @Field()
    name: string
}

@ObjectType({ description: 'A type that describes a User' })
export class User {
    @Field()
    id?: string

    @Field()
    displayName?: string

    @Field()
    givenName?: string

    @Field()
    surname?: string

    @Field()
    jobTitle?: string

    @Field()
    mobilePhone?: string

    @Field()
    mail?: string

    @Field()
    preferredLanguage?: string

    @Field(() => Role)
    role?: Role

    @Field(() => Subscription)
    subscription?: Subscription
}

@InputType({ description: 'Input object for Role used in Mutation addOrUpdateUser/bulkAddUsers' })
export class UserInput implements Partial<User> {
    @Field()
    id?: string

    @Field()
    displayName?: string

    @Field()
    givenName?: string

    @Field()
    surname?: string

    @Field()
    jobTitle?: string

    @Field()
    mobilePhone?: string

    @Field()
    mail?: string

    @Field()
    preferredLanguage?: string
}
