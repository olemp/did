import { filter, find, pick, contains, isEmpty } from 'underscore'
import { formatDate } from '../../../utils'
import EventMatching from './timesheet.matching'
import { connectEntities } from './project.utils'
import { getPeriods, connectTimeEntries } from './timesheet.utils'
import { gql, AuthenticationError, ApolloError } from 'apollo-server-express'
import { IGraphQLContext } from '../IGraphQLContext'

export const typeDef = gql`
  """
  A type that describes a TimeEntry
  """
  type Event {
    id: String
    title: String
    body: String
    isOrganizer: Boolean
    startDateTime: String
    endDateTime: String
    date: String
    duration: Float
    project: Project
    customer: Customer
    projectKey: String
    customerKey: String
    suggestedProject: Project
    webLink: String
    labels: [Label]
    isSystemIgnored: Boolean
    error: EventError
  }

  """
  A type that describes a TimesheetPeriod
  """
  type TimesheetPeriod {
    id: String!
    week: Int!
    month: String!
    startDateTime: String!
    endDateTime: String!
    events: [Event!]!
    matchedEvents: [Event!]!
    isConfirmed: Boolean
    isForecasted: Boolean
    isForecast: Boolean
    forecastedHours: Float!
  }

  """
  Input object for Event used in Mutation submitPeriod
  """
  input EventInput {
    id: String!
    projectId: String!
    manualMatch: Boolean
  }

  """
  Input object for TimesheetPeriod used in Mutation unsubmitPeriod
  """
  input TimesheetPeriodInput {
    id: String!
    startDateTime: String!
    endDateTime: String!
    matchedEvents: [EventInput]
    forecastedHours: Float
  }

  extend type Query {
    """
    Get timesheet for startDateTime - endDateTime
    """
    timesheet(startDateTime: String!, endDateTime: String!, dateFormat: String!, locale: String!): [TimesheetPeriod]!
  }

  extend type Mutation {
    """
    Adds matched time entries for the specified period and an entry for the confirmed period
    """
    submitPeriod(period: TimesheetPeriodInput!, forecast: Boolean!): BaseResult!

    """
    Deletes time entries for the specified period and the entry for the confirmed period
    """
    unsubmitPeriod(period: TimesheetPeriodInput!, forecast: Boolean!): BaseResult!
  }
`

/**
 * Timesheet
 *
 * @param {any} _obj {}
 * @param {any} variables Variables: startDateTime, endDateTime, dateFormat, locale
 * @param {IGraphQLContext} ctx GraphQL context
 */
async function timesheet(_obj: any, variables: any, ctx: IGraphQLContext) {
  if (!ctx.services.msgraph) throw new AuthenticationError('')
  try {
    const periods = getPeriods(variables.startDateTime, variables.endDateTime, variables.locale)
    // eslint-disable-next-line prefer-const
    let [projects, customers, timeentries, labels] = await Promise.all([
      ctx.services.azstorage.getProjects(),
      ctx.services.azstorage.getCustomers(),
      ctx.services.azstorage.getTimeEntries(
        {
          resourceId: ctx.user.id,
          startDateTime: variables.startDateTime,
          endDateTime: variables.endDateTime,
        },
        { sortAsc: true }
      ),
      ctx.services.azstorage.getLabels(),
    ])

    projects = connectEntities(projects, customers, labels)

    for (let i = 0; i < periods.length; i++) {
      const period = periods[i]
      const [confirmed, forecasted] = await Promise.all([
        ctx.services.azstorage.getConfirmedPeriod(ctx.user.id, period.id),
        ctx.services.azstorage.getForecastedPeriod(ctx.user.id, period.id),
      ])
      period.isForecasted = !!forecasted
      period.forecastedHours = period.isForecasted && forecasted.hours
      period.isConfirmed = !!confirmed
      if (period.isConfirmed) {
        period.events = connectTimeEntries(
          filter(timeentries, entry => entry.periodId === period.id),
          projects,
          customers,
          labels
        )
        period.matchedEvents = period.events
      } else {
        const eventMatching = new EventMatching(projects, customers, labels)
        period.events = await ctx.services.msgraph.getEvents(period.startDateTime, period.endDateTime)
        period.events = eventMatching.matchEvents(period.events)
        period.matchedEvents = period.events.filter(evt => !!evt.project)
      }
      period.events = period.events.map(evt => ({
        ...evt,
        date: formatDate(evt.startDateTime, variables.dateFormat, variables.locale),
      }))
    }
    return periods
  } catch (error) {
    throw new ApolloError(error.message, error.code, { statusCode: error.statusCode })
  }
}

/**
 * Submit period
 *
 * @param {any} _obj {}
 * @param {any} variables Variables
 * @param {IGraphQLContext} ctx GraphQL context
 */
async function submitPeriod(_obj: any, variables: { period: any, forecast: boolean }, ctx: IGraphQLContext) {
  try {
    const { period, forecast } = { ...variables }
    period.hours = 0
    if (!isEmpty(period.matchedEvents)) {
      const [events, labels] = await Promise.all([
        ctx.services.msgraph.getEvents(period.startDateTime, period.endDateTime),
        ctx.services.azstorage.getLabels(),
      ])
      const timeentries = period.matchedEvents.reduce((arr, event) => {
        const entry: any = {
          ...pick(event, 'projectId', 'manualMatch'),
          event: find(events, e => e.id === event.id),
        }
        if (!entry.event) return arr
        entry.labels = filter(labels, lbl => contains(event.categories, lbl.name)).map(lbl => lbl.name)
        return [...arr, entry]
      }, [])
      period.hours = await ctx.services.azstorage.addTimeEntries(pick(period, 'id'), ctx.user, timeentries, forecast)
    }
    if (forecast) {
      await ctx.services.azstorage.addForecastedPeriod(pick(period, 'id', 'hours'), ctx.user.id)
    } else {
      await ctx.services.azstorage.addConfirmedPeriod(pick(period, 'id', 'hours', 'forecastedHours'), ctx.user.id)
    }
    return { success: true, error: null }
  } catch (error) {
    return {
      success: false,
      error: pick(error, 'name', 'message', 'code', 'statusCode'),
    }
  }
}

/**
 * Unsubmit period
 *
 * @param {any} _obj {}
 * @param {any} variables Variables
 * @param {IGraphQLContext} ctx GraphQL context
 */
async function unsubmitPeriod(_obj: any, variables: any, ctx: IGraphQLContext) {
  try {
    if (variables.forecast) {
      await Promise.all([
        ctx.services.azstorage.deleteTimeEntries(variables.period.id, ctx.user.id, true),
        ctx.services.azstorage.removeForecastedPeriod(variables.period.id, ctx.user.id),
      ])
    } else {
      await Promise.all([
        ctx.services.azstorage.deleteTimeEntries(variables.period.id, ctx.user.id, false),
        ctx.services.azstorage.removeConfirmedPeriod(variables.period.id, ctx.user.id),
      ])
    }
    return { success: true, error: null }
  } catch (error) {
    return {
      success: false,
      error: pick(error, 'name', 'message', 'code', 'statusCode'),
    }
  }
}

export const resolvers = {
  Query: { timesheet },
  Mutation: { submitPeriod, unsubmitPeriod },
}
