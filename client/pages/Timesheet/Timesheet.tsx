import { useMutation, useQuery } from '@apollo/react-hooks';
import EventList from 'common/components/EventList';
import { UserAllocation } from 'common/components/UserAllocation';
import * as helpers from 'helpers';
import resource from 'i18n';
import { ITimeEntry } from 'interfaces';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { ProgressIndicator } from 'office-ui-fabric-react/lib/ProgressIndicator';
import * as React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ActionBar } from './ActionBar';
import CONFIRM_PERIOD from './CONFIRM_PERIOD';
import GET_TIMESHEET from './GET_TIMESHEET';
import { StatusBar } from './StatusBar';
import { SummaryView, SummaryViewType } from './SummaryView';
import { TimesheetContext } from './TimesheetContext';
import { TimesheetPeriod } from './TimesheetPeriod';
import { reducer } from './TimesheetReducer';
import { TimesheetScope } from './TimesheetScope';
import { TimesheetView, ITimesheetState } from './types';
import UNCONFIRM_PERIOD from './UNCONFIRM_PERIOD';
import { generateColumn as col } from 'utils/generateColumn';
import ProjectColumn from './ProjectColumn';

const intialState: ITimesheetState = {
    periods: [],
    selectedPeriod: new TimesheetPeriod(),
    scope: new TimesheetScope(),
};

/**
 * @category Timesheet
 */
export const Timesheet = () => {
    const history = useHistory();
    const params = useParams<{ startDateTime: string; view: TimesheetView }>();
    const [state, dispatch] = React.useReducer(reducer, intialState);
    const timesheetQuery = useQuery<{ timesheet: TimesheetPeriod[] }>(GET_TIMESHEET, {
        variables: {
            ...state.scope.iso,
            dateFormat: 'dddd DD',
        },
        fetchPolicy: 'network-only',
        skip: false
    });
    const [confirmPeriod] = useMutation<{ entries: any[]; startDateTime: string; endDateTime: string }>(CONFIRM_PERIOD);
    const [unconfirmPeriod] = useMutation<{ startDateTime: string; endDateTime: string }>(UNCONFIRM_PERIOD);

    React.useEffect(() => dispatch({ type: 'DATA_UPDATED', payload: timesheetQuery }), [timesheetQuery])
    React.useEffect(() => dispatch({ type: 'UPDATE_SCOPE', payload: params.startDateTime }), [params.startDateTime]);

    
    const onConfirmPeriod = () => {
        dispatch({ type: 'CONFIRMING_PERIOD' });
        confirmPeriod({ variables: { ...state.selectedPeriod.scope, entries: state.selectedPeriod.matchedEvents } }).then(timesheetQuery.refetch);
    }

    const onUnconfirmPeriod = () => {
        dispatch({ type: 'UNCONFIRMING_PERIOD' });
        unconfirmPeriod({ variables: state.selectedPeriod.scope }).then(timesheetQuery.refetch);
    }

    return (
        <TimesheetContext.Provider value={{ ...state, dispatch }}>
            <div className='c-Timesheet'>
                <ActionBar {...{ onConfirmPeriod, onUnconfirmPeriod }} />
                <Pivot
                    defaultSelectedKey={params.view}
                    onLinkClick={item => history.push(`/timesheet/${item.props.itemKey}/${state.scope.iso.startDateTime}`)}>
                    <PivotItem
                        itemKey='overview'
                        headerText={resource('TIMESHEET.OVERVIEW_HEADER_TEXT')}
                        itemIcon='CalendarWeek'>
                        <div className='c-Timesheet-overview'>
                            <StatusBar />
                            {state.loading && <ProgressIndicator {...state.loading} />}
                            <EventList
                                enableShimmer={!!state.loading}
                                events={state.selectedPeriod.events.filter(e => e.durationMinutes > 0)}
                                showEmptyDays={state.periods.length === 1}
                                dateFormat={'HH:mm'}
                                groups={{
                                    fieldName: 'date',
                                    groupNames: state.scope.weekdays('dddd DD'),
                                    totalFunc: (items: ITimeEntry[]) => {
                                        const totalMins = items.reduce((sum, i) => sum = i.durationMinutes, 0);
                                        return ` (${helpers.getDurationDisplay(totalMins)})`;
                                    },
                                }}
                                additionalColumns={[
                                    col(
                                        'project',
                                        'Project',
                                        { minWidth: 350, maxWidth: 350 },
                                        (event: ITimeEntry) => <ProjectColumn event={event} />
                                    ),
                                ]} />
                        </div>
                    </PivotItem>
                    <PivotItem
                        itemKey='summary'
                        headerText={resource('TIMESHEET.SUMMARY_HEADER_TEXT')}
                        itemIcon='List'>
                        <SummaryView type={SummaryViewType.UserWeek} />
                    </PivotItem>
                    <PivotItem
                        itemKey='allocation'
                        headerText={resource('TIMESHEET.ALLOCATION_HEADER_TEXT')}
                        itemIcon='ReportDocument'>
                        <UserAllocation
                            entries={state.selectedPeriod.events}
                            charts={{
                                'project.name': resource('TIMESHEET.ALLOCATION_PROJECT_CHART_TITLE'),
                                'customer.name': resource('TIMESHEET.ALLOCATION_CUSTOMER_CHART_TITLE'),
                            }} />
                    </PivotItem>
                </Pivot>
            </div>
        </TimesheetContext.Provider>
    );
}