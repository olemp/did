import 'reflect-metadata'
import { Field, Float, InputType } from 'type-graphql'

/**
 * @category GraphQL InputType
 */
@InputType({
  description: 'Input object for Event used in Mutation submitPeriod'
})
export class EventInput {
  @Field()
  id: string

  @Field()
  projectId: string

  @Field({ nullable: true })
  manualMatch: boolean

  @Field({ nullable: true })
  startDateTime?: Date

  @Field({ nullable: true })
  endDateTime?: Date

  @Field(() => Float, { nullable: true })
  originalDuration?: number

  @Field(() => Float, { nullable: true })
  duration?: number
}
