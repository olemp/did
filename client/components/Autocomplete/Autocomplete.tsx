import { Callout, FocusZone, FocusZoneDirection, Label, List, SearchBox } from 'office-ui-fabric'
import React, { useLayoutEffect, useMemo, useReducer, useRef } from 'react'
import { isEmpty } from 'underscore'
import { IAutocompleteProps } from '.'
import styles from './Autocomplete.module.scss'
import createReducer, {
  DISMISS_CALLOUT,
  INIT,
  ON_KEY_DOWN,
  ON_SEARCH,
  RESET,
  SET_SELECTED_INDEX
} from './reducer'
import { SuggestionItem } from './SuggestionItem'

export function Autocomplete<T = any>(props: IAutocompleteProps<T>) {
  const reducer = useMemo(() => createReducer(), [])
  const [state, dispatch] = useReducer(reducer, { selectedIndex: -1, suggestions: [] })
  const field = useRef<HTMLDivElement>()

  useLayoutEffect(() => dispatch(INIT({ props })), [props])

  const classNames = [styles.root, props.errorMessage && styles.hasError]

  const suggestions = useMemo(() => state.suggestions.map((s, idx) => ({
    ...s,
    isSelected: idx === state.selectedIndex
  })), [state.suggestions, state.selectedIndex])

  return (
    <div
      className={classNames.join(' ')}
      onKeyDown={(event) =>
        dispatch(
          ON_KEY_DOWN({
            key: event.which,
            onEnter: (item) => props.onSelected(item)
          })
        )
      }>
      {props.label && (
        <Label disabled={props.disabled} required={props.required}>
          {props.label}
        </Label>
      )}
      <div ref={field}>
        <SearchBox
          className={styles.field}
          value={state.value}
          iconProps={{ iconName: state.selectedItem?.iconName || 'Search' }}
          placeholder={props.placeholder}
          disabled={props.disabled}
          autoComplete='off'
          autoCorrect='off'
          onClear={() => {
            dispatch(RESET())
            props.onClear()
          }}
          onChange={(_event, searchTerm) => dispatch(ON_SEARCH({ searchTerm }))}
        />
      </div>
      <div hidden={!props.description} className={styles.description}>
        {props.description}
      </div>
      <div hidden={!props.errorMessage} role='alert'>
        <p className={styles.errorMessage}>
          <span>{props.errorMessage}</span>
        </p>
      </div>
      <Callout
        gapSpace={2}
        alignTargetEdge={true}
        hidden={isEmpty(state.suggestions)}
        onDismiss={() => dispatch(DISMISS_CALLOUT({ item: null }))}
        calloutMaxHeight={props.maxHeight || 450}
        style={{ width: field.current?.clientWidth }}
        target={field?.current}
        directionalHint={5}
        isBeakVisible={false}>
        <div>
          <FocusZone direction={FocusZoneDirection.vertical}>
            <List
              tabIndex={0}
              items={suggestions}
              onRenderCell={(item, idx) => (
                <SuggestionItem
                  key={item.key}
                  item={item}
                  itemIcons={props.itemIcons}
                  onClick={() => {
                    dispatch(DISMISS_CALLOUT({ item }))
                    props.onSelected(item)
                  }}
                  onMouseOver={() => dispatch(SET_SELECTED_INDEX({ index: idx }))}
                />
              )}
            />
          </FocusZone>
        </div>
      </Callout>
    </div>
  )
}
