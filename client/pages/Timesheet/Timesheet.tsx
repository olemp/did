import { useMutation, useQuery } from '@apollo/react-hooks'
import { HotkeyModal } from 'components'
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot'
import React, { useEffect, useMemo, useReducer } from 'react'
import { GlobalHotKeys } from 'react-hotkeys'
import { useTranslation } from 'react-i18next'
import { useHistory, useParams } from 'react-router-dom'
import { ActionBar } from './ActionBar'
import { AllocationView } from './AllocationView'
import CONFIRM_PERIOD from './CONFIRM_PERIOD'
import GET_TIMESHEET from './GET_TIMESHEET'
import hotkeys from './hotkeys'
import { Overview } from './Overview'
import reducer from './reducer'
import { SummaryView } from './SummaryView'
import styles from './Timesheet.module.scss'
import { ITimesheetContext, ITimesheetParams, ITimesheetPeriod, TimesheetContext, TimesheetPeriod, TimesheetScope } from './types'
import UNCONFIRM_PERIOD from './UNCONFIRM_PERIOD'

/**
 * @category Timesheet
 */
export const Timesheet = () => {
    const { t } = useTranslation(['timesheet', 'common'])
    const history = useHistory()
    const params = useParams<ITimesheetParams>()
    const [state, dispatch] = useReducer(reducer, {
        periods: [],
        selectedPeriod: new TimesheetPeriod(undefined, params),
        scope: new TimesheetScope(params),
    })
    const query = useQuery<{ timesheet: ITimesheetPeriod[] }>(GET_TIMESHEET, {
        variables: {
            ...state.scope.dateStrings,
            dateFormat: 'dddd DD',
        },
        fetchPolicy: 'cache-and-network',
    })
    
    const [confirmPeriod] = useMutation<{ entries: any[]; startDateTime: string; endDateTime: string }>(CONFIRM_PERIOD)
    const [unconfirmPeriod] = useMutation<{ startDateTime: string; endDateTime: string }>(UNCONFIRM_PERIOD)

    useEffect(() => { dispatch({ type: 'DATA_UPDATED', payload: { query, t } }) }, [query])

    useEffect(() => { history.push(`/timesheet/${state.selectedPeriod.path}`) }, [state.selectedPeriod])

    const onConfirmPeriod = () => {
        dispatch({ type: 'CONFIRMING_PERIOD', payload: { t } })
        confirmPeriod({ variables: { period: state.selectedPeriod.data } }).then(query.refetch)
    }

    const onUnconfirmPeriod = () => {
        dispatch({ type: 'UNCONFIRMING_PERIOD', payload: { t } })
        unconfirmPeriod({ variables: { period: state.selectedPeriod.data } }).then(query.refetch)
    }

    const ctx: ITimesheetContext = useMemo(() => ({
        ...state,
        onConfirmPeriod,
        onUnconfirmPeriod,
        dispatch,
    }), [state])

    const hotkeysProps = useMemo(() => hotkeys(ctx, t), [ctx])

    return (
        <GlobalHotKeys {...hotkeysProps}>
            <TimesheetContext.Provider value={ctx}>
                <div className={styles.root}>
                    <ActionBar />
                    <Pivot>
                        <PivotItem
                            itemKey='overview'
                            headerText={t('overviewHeaderText')}
                            itemIcon='CalendarWeek'>
                            <Overview dayFormat='dddd DD' timeFormat='HH:mm' />
                        </PivotItem>
                        <PivotItem
                            itemKey='summary'
                            headerText={t('summaryHeaderText')}
                            itemIcon='List'>
                            <SummaryView />
                        </PivotItem>
                        <PivotItem
                            itemKey='allocation'
                            headerText={t('allocationHeaderText')}
                            itemIcon='ReportDocument'>
                            <AllocationView />
                        </PivotItem>
                    </Pivot>
                </div>
            </TimesheetContext.Provider>
            <HotkeyModal
                {...hotkeysProps}
                isOpen={state.showHotkeysModal}
                onDismiss={() => dispatch({ type: 'TOGGLE_SHORTCUTS' })} />
        </GlobalHotKeys>
    )
}