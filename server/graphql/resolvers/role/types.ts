/* eslint-disable max-classes-per-file */
import 'reflect-metadata'
import { Field, ID, InputType, ObjectType } from 'type-graphql'

/**
 * @category GraphQL ObjectType
 */
@ObjectType({
  description: 'A type that describes a Role',
  simpleResolvers: true
})
export class Role {
  @Field(() => ID)
  name?: string

  @Field({ nullable: true })
  description?: string

  @Field()
  icon?: string

  @Field(() => [String])
  permissions?: string[]

  @Field({ nullable: true })
  readOnly?: boolean

  @Field({ nullable: true })
  enabledForExternalUsers?: boolean
}

/**
 * @category GraphQL InputType
 */
@InputType({
  description: 'Input object for Role used in Mutation addOrUpdateRole'
})
export class RoleInput {
  @Field()
  name?: string

  @Field({ nullable: true })
  description?: string

  @Field()
  icon?: string

  @Field(() => [String])
  permissions?: string[]

  @Field({ nullable: true })
  readOnly?: boolean

  @Field({ nullable: true })
  enabledForExternalUsers?: boolean
}
