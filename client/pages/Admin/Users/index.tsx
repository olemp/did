import { useMutation, useQuery } from '@apollo/client'
import List from 'components/List'
import { ISpinnerProps, Spinner } from 'office-ui-fabric'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { User } from 'types'
import { any, filter, isEmpty, omit } from 'underscore'
import $bulkImport from './bulkImport.gql'
import { BulkImportPanel, IBulkImportPanelProps } from './BulkImportPanel'
import { UserColumns as columns } from './columns'
import { IUsersContext, UsersContext } from './context'
import { IUserFormProps, UserForm } from './UserForm'
import $users from './users.gql'

export const Users = () => {
  const { t } = useTranslation()
  const [userForm, setUserForm] = useState<IUserFormProps>(null)
  const [bulkImportPanel, setBulkImportPanel] = useState<IBulkImportPanelProps>(null)
  const [progressProps, setProgressProps] = useState<ISpinnerProps>(null)
  const { data, refetch, loading } = useQuery($users, { fetchPolicy: 'cache-and-network' })
  const [bulkImport] = useMutation($bulkImport)
  const ctxValue: IUsersContext = useMemo(
    () => ({
      roles: data?.roles || [],
      users: data?.users || [],
      adUsers: data?.adUsers || []
    }),
    [data]
  )
  ctxValue.adUsers = filter(ctxValue.adUsers, (x) => !any(ctxValue.users, (y) => y.id === x.id))

  /**
   * On edit user
   *
   * @param {User} user User to edit
   */
  const onEdit = (user: User) =>
    setUserForm({
      headerText: user.displayName,
      user
    })

  /**
   * On import users
   *
   * @param {any[]} users Users to import
   */
  const onBulkImport = async (users: any[]) => {
    setBulkImportPanel(null)
    setProgressProps({
      label: t('admin.bulkImportingUsersLabel', { count: users.length }),
      labelPosition: 'right'
    })
    await bulkImport({ variables: { users: users.map((u) => omit(u, '__typename')) } })
    setProgressProps(null)
    refetch()
  }

  return (
    <UsersContext.Provider value={ctxValue}>
      <List
        enableShimmer={loading}
        items={ctxValue.users}
        columns={columns(onEdit, t)}
        commandBar={{
          items: [
            {
              key: 'ADD_NEW_USER',
              name: t('admin.addNewUser'),
              iconProps: { iconName: 'AddFriend' },
              disabled: isEmpty(ctxValue.adUsers),
              onClick: () => setUserForm({ headerText: t('admin.addNewUser') })
            },
            {
              key: 'BULK_IMPORT_USERS',
              name: t('admin.bulkImportUsersLabel'),
              iconProps: { iconName: 'CloudImportExport' },
              disabled: isEmpty(ctxValue.adUsers),
              onClick: () => setBulkImportPanel({ isOpen: true })
            },
            {
              key: 'SPINNER',
              name: '',
              onRender: () => progressProps && <Spinner styles={{ root: { marginLeft: 15 } }} {...progressProps} />
            }
          ],
          farItems: []
        }}
      />
      {userForm && (
        <UserForm
          {...userForm}
          onDismiss={(event) => {
            setUserForm(null)
            !event && refetch()
          }}
        />
      )}
      {bulkImportPanel && (
        <BulkImportPanel {...bulkImportPanel} onImport={onBulkImport} onDismiss={() => setBulkImportPanel(null)} />
      )}
    </UsersContext.Provider>
  )
}
