import { SearchBox } from '@fluentui/react-components'
import React, { useRef } from 'react'
import { StyledComponent } from 'types'
import _ from 'lodash'
import { EXECUTE_SEARCH } from '../../reducer'
import { useListContext } from '../../context'
import { IListProps } from 'components'
import styles from '../ListHeader.module.scss'
import { css } from '@fluentui/react'

export const SearchBoxComponent: StyledComponent<IListProps['searchBox']> = (
  props
) => {
  const context = useListContext()
  const searchDelay = useRef(null)
  return (
    <div hidden={props.hidden}>
      <SearchBox
        {..._.omit(props, 'contentAfter', 'placeholder', 'fullWidth')}
        className={css(
          SearchBoxComponent.className,
          props.fullWidth && styles.fullWidth
        )}
        contentAfter={
          _.isFunction(props.contentAfter)
            ? props.contentAfter(context.state)
            : props.contentAfter
        }
        placeholder={
          _.isFunction(props.placeholder)
            ? props.placeholder(context.state)
            : props.placeholder
        }
        defaultValue={context.state.searchTerm}
        onChange={(_event, data) => {
          searchDelay.current && clearTimeout(searchDelay.current)
          searchDelay.current = setTimeout(() => {
            if (props.onChange) props.onChange(_event, data)
            context.dispatch(EXECUTE_SEARCH({ searchTerm: data?.value }))
          }, props.searchDelayMs)
        }}
      />
    </div>
  )
}

SearchBoxComponent.displayName = 'SearchBox'
SearchBoxComponent.className = styles.searchBox
SearchBoxComponent.defaultProps = {
  searchDelayMs: 300
}
