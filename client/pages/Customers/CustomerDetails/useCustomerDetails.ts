import { ListMenuItem, TabItems } from 'components'
import { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ProjectList } from '../../Projects'
import { CustomersContext } from '../context'
import { CLOSE_PROJECT_PANEL, OPEN_PROJECT_PANEL } from '../reducer/actions'
import { useProjectsQuery } from './useProjectsQuery'

export function useCustomerDetails() {
  const { t } = useTranslation()
  const context = useContext(CustomersContext)
  const selected = context.state.selected
  const [projects, { error, refetch }] = useProjectsQuery(selected)
  const tabs: TabItems = useMemo(
    () => ({
      projects: [
        ProjectList,
        { text: t('customers.projectsHeaderText'), iconName: 'Collections' },
        {
          hideColumns: ['customer'],
          enableShimmer: context.loading,
          searchBox: {
            placeholder: t('customers.searchProjectsPlaceholder', selected),
            disabled: context.loading
          },
          menuItems: [
            new ListMenuItem(t('customers.createProjectButtonLabel'))
              .withIcon('AddCircle')
              .setGroup('actions')
              .setOnClick(() => {
                context.dispatch(
                  OPEN_PROJECT_PANEL({
                    onDismissCallback: () =>
                      context.dispatch(CLOSE_PROJECT_PANEL())
                  })
                )
              })
          ]
        }
      ]
    }),
    [context.state, context.loading, selected, projects]
  )
  return { projects, error, tabs, refetch }
}
