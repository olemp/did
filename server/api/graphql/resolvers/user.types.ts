/* eslint-disable max-classes-per-file */
import 'reflect-metadata'
import { Field, InputType, ObjectType } from 'type-graphql'
import { Role } from './role.types'

@ObjectType({ description: 'The ISubscription model' })
export class Subscription {
    @Field()
    name: string
}

@ObjectType({ description: 'The User model' })
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

@InputType()
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
