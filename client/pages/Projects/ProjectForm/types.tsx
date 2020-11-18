import { getIcons } from 'common/icons'
import { IFormValidation, Project, ProjectOptions } from 'types'
import { first } from 'underscore'

export interface IProjectFormProps {
  /**
   * Project to edit
   */
  edit?: Project

  /**
   * On submitted callback
   */
  onSubmitted?: () => void
}

export class ProjectModel {
  public key = ''
  public name = ''
  public customerKey = ''
  public description = ''
  public inactive = false
  public icon = first(getIcons(1))
  public labels: string[] = []

  constructor(project?: Project) {
    if (!!project) {
      this.key = project.key
      this.name = project.name
      this.customerKey = project.customerKey
      this.description = project.description
      this.inactive = project.inactive
      this.icon = project.icon
      this.labels = project.labels.map((label) => label.name)
    }
  }

  public clone(): ProjectModel {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this)
  }
}

export interface IProjectFormState {
  model: ProjectModel
  options: ProjectOptions
  editMode: boolean
  projectId?: string
  validation?: IFormValidation
}

export interface IProjectFormValidationOptions {
  nameMinLength?: number
}
