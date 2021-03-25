import { Theme } from '@fluentui/react'
import { default as lightTheme } from './light'

/**
 * Get theme by name
 *
 * @param name - Theme name
 *
 * @returns the theme with palette
 */
export function getTheme(name: string): Theme {
  switch (name) {
    default:
      return lightTheme
  }
}

export { lightTheme }
