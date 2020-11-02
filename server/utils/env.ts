import { isBlank } from 'underscore.string'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const log = require('debug')('env')

/**
 * Get environment variable by key with optional fallbackvalue
 *
 * @param {string} key Key
 * @param {any} fallbackValue Fallback vaue if key is not found
 */
const getEnvironmentVariable = (key: string, fallbackValue: any = null) => {
  const value = process.env[key]
  if (isBlank(value)) {
    log('Missing environment variable %s', key)
    return fallbackValue || null
  }
  return value
}

export default getEnvironmentVariable