export interface INotificationTemplates {
  unconfirmedPeriods: string
  forecast: string
}

/**
 * Variables for query notifications
 */
export interface INotificationsQueryVariables {
  locale: string
  templates: INotificationTemplates
}
