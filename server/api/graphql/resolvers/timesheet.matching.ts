import { first, find, filter, contains, isEmpty } from 'underscore'
import { findBestMatch } from 'string-similarity'
import get from 'get-value'

class EventMatching {
  public projects: any[]
  public customers: any[]
  public labels: any[]

  /**
   * Constructs a new EventMatching class
   *
   * @param {any[]} projects Projects
   * @param {any[]} customers Customers
   * @param {any[]} labels Labels
   */
  constructor(projects: any[], customers: any[], labels: any[]) {
    this.projects = projects
    this.customers = customers
    this.customers = labels
  }

  /**
   * Find project suggestions using findBestMatch from string-similarity
   *
   * @param {*} customer Customer
   * @param {*} projectKey Project key
   */
  findProjectSuggestion(customer: any, projectKey: any) {
    try {
      const customerProjects = this.projects.filter(p => p.customerKey === customer.key)
      const projectKeys = customerProjects.map(p => p.id.split(' ')[1])
      const sm = findBestMatch(projectKey, projectKeys)
      const target = sm.bestMatch && sm.bestMatch.rating > 0 ? sm.bestMatch.target : null
      if (!target) return null
      const suggestion = first(customerProjects.filter(p => p.id.split(' ')[1] === target.toUpperCase()))
      return suggestion
    } catch (error) {
      return null
    }
  }

  /**
   * Looks for ignore "tag" in event.
   *
   * @returns
   * * Returns 'category' if ignore category is found
   * * Returns 'body' if ignore tag is found in body
   * * Otherwise returns nulll
   *
   * @param {*} event
   */
  findIgnore(event: { body: string; categories: string[] }) {
    const ignoreCategory = find(event.categories, c => c.toLowerCase() === 'ignore')
    if (!!ignoreCategory) return 'category'
    if ((event.body || '').match(/[(\[\{]IGNORE[)\]\}]/gi) !== null) return 'body'
    return null
  }

  /**
   * Find project match in title/subject/categories
   *
   * @param {string} inputStr The String object or string literal on which to perform the search.
   * @param {boolean} soft Soft search - don't require [], () or {}
   */
  searchString(inputStr: string, soft = false) {
    let regex = /[\(\{\[]((?<customerKey>[\wæøåÆØÅ]{2,}?)\s(?<key>[\wæøåÆØÅ]{2,}?))[\)\]\}]/gim
    if (soft) regex = /((?<customerKey>[\wæøåÆØÅ]{2,}?)\s(?<key>[\wæøåÆØÅ]{2,}))/gim
    const matches = []
    let match
    while ((match = regex.exec(inputStr)) !== null) {
      matches.push({
        ...match.groups,
        id: `${match.groups.customerKey} ${match.groups.key}`,
      })
    }
    return matches
  }

  /**
   * Find project match in title/body/categories
   *
   * @param {*} inputStr The String object or string literal on which to perform the search.
   * @param {*} categoriesStr Categories string
   */
  findProjectMatches(inputStr: any, categoriesStr: any) {
    const matches = this.searchString(categoriesStr, true)
    return matches || this.searchString(inputStr)
  }

  /**
   * Find label matches in categories
   *
   * @param {*} categories
   */
  findLabels(categories: any) {
    return filter(this.labels, lbl => contains(categories, lbl.name))
  }

  /**
   * Checks for project match in event
   *
   * 1. Checks category/title/description for tokens
   * 2. Checks title/description for key without any brackets/parantheses
   *
   * @param {*} event
   */
  matchEvent(event: any) {
    const ignore = this.findIgnore(event)
    if (ignore === 'category') {
      return { ...event, isSystemIgnored: true }
    }
    const categoriesStr = event.categories.join('|').toUpperCase()
    const srchStr = [event.title, event.body, categoriesStr].join('|').toUpperCase()
    const matches = this.findProjectMatches(srchStr, categoriesStr)
    let projectKey
    if (!isEmpty(matches)) {
      for (let i = 0; i < matches.length; i++) {
        const { id, key, customerKey } = matches[i]
        event.customer = find(this.customers, c => customerKey === c.key)
        if (!!event.customer) {
          event.project = find(this.projects, p => p.id === id)
          projectKey = key
        }
        if (!!event.project) break
      }
    } else if (ignore === 'body') {
      return { ...event, isSystemIgnored: true }
    } else {
      event.project = find(this.projects, p => !!find(this.searchString(srchStr, true), m => m.id === p.id))
      if (!!event.project) event.customer = find(this.customers, c => c.key === event.project.customerKey)
    }
    if (!!event.customer && !event.project) {
      event.suggestedProject = this.findProjectSuggestion(event.customer, projectKey)
    }
    event.labels = this.findLabels(event.categories)
    event = this.checkInactive(event)
    return event
  }

  /**
   * Check if project or customer is marked as inactive
   *
   * @param {*} event
   */
  checkInactive(event: any) {
    const inactiveProject = get(event, 'project.inactive')
    const inactiveCustomer = get(event, 'customer.inactive')
    if (event.project && (inactiveProject || inactiveCustomer)) {
      if (inactiveProject) event.error = { code: 'PROJECT_INACTIVE' }
      if (inactiveCustomer) event.error = { code: 'CUSTOMER_INACTIVE' }
      event.project = null
      event.customer = null
    }
    return event
  }

  /**
   * Match events
   *
   * @param {*} events
   */
  matchEvents(events: any) {
    return events.map(this.matchEvent.bind(this))
  }
}

export default EventMatching
