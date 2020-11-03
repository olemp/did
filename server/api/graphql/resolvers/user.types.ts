export interface IRole {
  name?: string
  icon?: string
  permissions?: string[]
}

export interface ISubscription {
  name: string
}

export interface IUser {
  id?: string
  displayName?: string
  givenName?: string
  surname?: string
  jobTitle?: string
  mobilePhone?: string
  mail?: string
  preferredLanguage?: string
  subscription?: ISubscription
  role?: IRole
}

/**
 * Variables for query users
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUsersQueryVariables {}

/**
 * Variables for query users
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICurrentUserQueryVariables {}

/**
 * Variables for mutation addOrUpdateUser
 */
export interface IAddOrUpdateUserVariables {
  user: IUser;
  update: boolean;
}

/**
 * Variables for mutation bulkAddUsers
 */
export interface IBulkAddUsersVariables {
  users: IUser[];
}