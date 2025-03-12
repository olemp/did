import { QueryResult } from '@apollo/client'
import { createAction } from '@reduxjs/toolkit'
import { Project } from 'types'
import { IProjectsState } from '../types'

type DATA_UPDTED_PAYLOAD = QueryResult<
  Pick<IProjectsState, 'projects' | 'outlookCategories'> & {
    myProjects: {
      tag: string
    }[]
  }
>

export const DATA_UPDATED = createAction<DATA_UPDTED_PAYLOAD>('DATA_UPDATED')
export const SET_SELECTED_PROJECT = createAction<Project | string>(
  'SET_SELECTED_PROJECT'
)
export const OPEN_EDIT_PANEL = createAction<Project>('OPEN_EDIT_PANEL')
export const CLOSE_EDIT_PANEL = createAction('CLOSE_EDIT_PANEL')
export const PROJECT_DELETE_SUCCESS = createAction('PROJECT_DELETE_SUCCESS')
