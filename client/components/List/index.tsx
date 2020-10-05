import { ScrollablePaneWrapper } from 'components/ScrollablePaneWrapper'
import { CheckboxVisibility, ConstrainMode, DetailsListLayoutMode, IColumn, IDetailsGroupDividerProps, IDetailsHeaderProps, Selection, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList'
import { GroupHeader } from 'office-ui-fabric-react/lib/GroupedList'
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox'
import { ShimmeredDetailsList } from 'office-ui-fabric-react/lib/ShimmeredDetailsList'
import React, { useEffect, useReducer } from 'react'
import FadeIn from 'react-fade-in'
import { filter, first } from 'underscore'
import { withDefaultProps } from 'with-default-props'
import { generateListGroups } from './generateListGroups'
import { ListHeader } from './ListHeader'
import reducer from './reducer'
import { IListProps } from './types'
import { sleep } from 'utils'
import styles from './List.module.scss'
import { value } from 'helpers'

/**
 * List component using DetailsList from office-ui-fabric-react
 */
const List = (props: IListProps) => {
    const [state, dispatch] = useReducer(reducer, {
        origItems: props.items,
        items: props.items,
        searchTerm: null,
    })
    let selection = null

    useEffect(() => dispatch({ type: 'PROPS_UPDATED', payload: props }), [props.items])

    selection = props.selection && new Selection({
        onSelectionChanged: () => {
            const _selection = selection.getSelection()
            // eslint-disable-next-line default-case
            switch (props.selection?.mode) {
                case SelectionMode.single: props.selection.onChanged(first(_selection))
                    break
                case SelectionMode.multiple: props.selection.onChanged(_selection)
                    break
            }

        }
    })

    const onRenderListHeader = (headerProps: IDetailsHeaderProps, defaultRender: (props: IDetailsHeaderProps) => JSX.Element) => {
        if (!!props.onRenderDetailsHeader) return onRenderListHeader(headerProps, defaultRender)
        const searchBox = props.searchBox && ({
            key: 'SEARCH_BOX',
            onRender: () => (
                <SearchBox
                    {...props.searchBox}
                    className={styles.searchBox}
                    onChange={(_event, newValue) => sleep(0.4).then(() => dispatch({ type: 'SEARCH', payload: newValue }))} />
            ),
        })
        const commandBarItems = [searchBox, ...props.commandBar.items].filter(c => c)
        return (
            <ListHeader
                headerProps={headerProps}
                defaultRender={defaultRender}
                commandBar={{ ...props.commandBar, items: commandBarItems }} />
        )
    }

    const onRenderGroupHeader = (headerProps: IDetailsGroupDividerProps) => {
        return <GroupHeader {...headerProps} styles={{ title: { cursor: 'initial' }, expand: { cursor: 'pointer' }, headerCount: { display: 'none' } }}></GroupHeader>
    }

    let groups = null
    let items = [...state.items]
    if (props.groups) [groups, items] = generateListGroups(items, props.groups)

    const [delay, transitionDuration] = props.fadeIn

    return (
        <div className={styles.root} hidden={props.hidden}>
            <FadeIn delay={delay} transitionDuration={transitionDuration}>
                <ScrollablePaneWrapper condition={!!props.height} height={props.height}>
                    <ShimmeredDetailsList
                        getKey={(_item, index) => `list_item_${index}`}
                        setKey={'list'}
                        enableShimmer={props.enableShimmer}
                        isPlaceholderData={props.enableShimmer}
                        selection={selection}
                        columns={filter(props.columns, col => !col.data?.hidden)}
                        items={items}
                        groups={groups}
                        selectionMode={props.selection ? props.selection.mode : SelectionMode.none}
                        constrainMode={ConstrainMode.horizontalConstrained}
                        layoutMode={DetailsListLayoutMode.justified}
                        groupProps={{
                            ...props.groupProps,
                            onRenderHeader: onRenderGroupHeader,
                        }}
                        onRenderItemColumn={(item, index, column) => {
                            if (!!column.onRender) return column.onRender(item, index, column)
                            return value(item, column.fieldName)
                        }}
                        onRenderDetailsHeader={onRenderListHeader}
                        checkboxVisibility={props.checkboxVisibility || CheckboxVisibility.hidden} />
                </ScrollablePaneWrapper>
            </FadeIn>
        </div>
    )
}

export default withDefaultProps(List, {
    fadeIn: [0, 0],
    commandBar: {
        items: [],
        farItems: [],
    }
} as IListProps)

export { SelectionMode, IColumn }

