import { createAction } from '@reduxjs/toolkit'
import { IFormControlState } from '../types'

/**
 * `SET_VALIDATION_MESSAGES`: Set the validation messages for the form. The validation messages
 * are merged with the existing validation messages.
 */
export const SET_VALIDATION_MESSAGES = createAction<
  IFormControlState['validationMessages']
>('SET_VALIDATION_MESSAGES')

/**
 * `CLEAR_VALIDATION_MESSAGE`: Clear the validation message for the specified field.
 */
export const CLEAR_VALIDATION_MESSAGE = createAction<{ name: string }>(
  'CLEAR_VALIDATION_MESSAGE'
)

/**
 * `CLEAR_VALIDATION_MESSAGES`: Clears the provided validation messages,
 * or clears all validation messages if no payload is provided.
 */
export const CLEAR_VALIDATION_MESSAGES = createAction<string[]>(
  'CLEAR_VALIDATION_MESSAGES'
)
