import * as utils from '../utils'

class MSGraphEvent {
  id: any
  title: any
  body: any
  isOrganizer: any
  categories: any
  webLink: any
  startDateTime: any
  endDateTime: any
  duration: any

  constructor(evt: any) {
    this.id = evt.id
    this.title = evt.subject
    this.body = utils.stripHtmlString(evt.body.content)
    this.isOrganizer = evt.isOrganizer
    this.categories = evt.categories
    this.webLink = evt.webLink
    this.startDateTime = evt.start.dateTime
    this.endDateTime = evt.end.dateTime
    this.duration = utils.getDurationHours(evt.start.dateTime, evt.end.dateTime)
  }
}

export default MSGraphEvent
