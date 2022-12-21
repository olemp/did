/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unicorn/prevent-abbreviations */
import { PivotItem } from '@fluentui/react'
import { ContextUser } from 'AppContext'
import React, { JSXElementConstructor, ReactElement } from 'react'
import _ from 'underscore'
import { ITabItemProps } from './types'

type RenderTabs = {
  tabs: any
  props: ITabItemProps
  user: ContextUser
}

/**
 * Renders the tabs for the `<TabContainer />`
 */
export function renderTabs({ tabs, props, user }: RenderTabs) {
  return tabs.map((item: ReactElement) => {
    if (_.isArray(item)) return renderTabs({ tabs: item, props, user })
    if (item.props.hidden) return null
    if (item.props.permission && !user.hasPermission(item.props.permission)) {
      return null
    }
    const type = item?.type as JSXElementConstructor<any>
    switch (type?.name) {
      case 'PivotItem': {
        return item
      }
      default: {
        const mergedProps = {
          itemKey: type?.name.toLowerCase(),
          ...item.props,
          props
        }
        return (
          <PivotItem key={mergedProps.itemKey} {...mergedProps}>
            {item}
          </PivotItem>
        )
      }
    }
  })
}
