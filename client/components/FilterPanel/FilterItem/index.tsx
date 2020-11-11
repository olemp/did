import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox'
import React, { useState, useMemo } from 'react'
import styles from './FilterItem.module.scss'
import { IFilterItemProps } from './types'
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox'
import { contains, isBlank } from 'underscore.string'
import { useTranslation } from 'react-i18next'

export const FilterItem = (props: IFilterItemProps) => {
    const { t } = useTranslation()
    const selectedKeys = props.filter.selected.map(f => f.key)
    const [searchTerm, onSearch] = useState<string>('')
    const [showCount, setShowCount] = useState(props.shortListCount)

    const items = useMemo(() => props.filter.items.filter(item => {
        if (isBlank(searchTerm)) return true
        return contains(item.value.toLowerCase(), searchTerm.toLowerCase())
    }), [searchTerm])

    return (
        <div className={styles.root}>
            <div className={styles.name}>{props.filter.name}</div>
            <div className={styles.searchBox} hidden={props.filter.items.length < 10}>
                <SearchBox
                    placeholder={t('common.searchPlaceholder')}
                    onChange={(_event, value) => onSearch(value)} />
            </div>
            {[...items].slice(0, showCount).map(item => (
                <div key={item.key} className={styles.item}>
                    <Checkbox
                        label={item.value}
                        checked={selectedKeys.indexOf(item.key) !== -1}
                        onChange={(_, checked) => props.onFilterUpdated(props.filter, item, checked)} />
                </div>
            ))}
            <div
                className={styles.showAllLink}
                hidden={items.length < 10 || showCount === props.filter.items.length}
                onClick={() => setShowCount(props.filter.items.length)}>{t('common.showAllFiltersText', { count: props.filter.items.length })}</div>
        </div >
    )
}
