import { resolvers as customerResolvers } from './customer'
import { resolvers as projectResolvers } from './project'
import { resolvers as timesheetResolvers } from './timesheet'
import { resolvers as timeentryResolvers } from './timeentry'
import { resolvers as userResolvers } from './user'
import { resolvers as outlookCategoryResolvers } from './outlookCategory'
import { resolvers as labelResolvers } from './label'
import { resolvers as roleResolvers } from './role'
import { resolvers as notificationResolvers } from './notification'
import { resolvers as addApiTokenResolvers } from './apiToken'
import { merge } from 'lodash'

export default merge(
  customerResolvers,
  projectResolvers,
  timeentryResolvers,
  labelResolvers,
  outlookCategoryResolvers,
  userResolvers,
  roleResolvers,
  addApiTokenResolvers,
  timesheetResolvers,
  notificationResolvers
)
