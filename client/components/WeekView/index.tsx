
import { useMutation, useQuery } from '@apollo/react-hooks';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as React from 'react';
import { weekNumber as currentWeekNumber } from 'weeknumber';
import { CONFIRM_WEEK, IConfirmWeek } from './CONFIRM_WEEK';
import { EventList } from './EventList';
import { GET_WEEK_VIEW, IGetWeekView } from './GET_WEEK_VIEW';
import { IWeekViewState } from './IWeekViewState';
import { UNCONFIRM_WEEK } from './UNCONFIRM_WEEK';
import { WeekStatusBar } from './WeekStatusBar';
import * as getValue from 'get-value';

export const WeekView = ({ weeksToShow }) => {
    const initialWeekNumber = document.location.hash ? parseInt(document.location.hash.substring(1)) : currentWeekNumber();
    let [state, setState] = React.useState<IWeekViewState>({ weekNumber: initialWeekNumber, confirmedHours: undefined, processing: false });
    const [[confirmWeek], [unconfirmWeek]] = [useMutation<IConfirmWeek>(CONFIRM_WEEK), useMutation(UNCONFIRM_WEEK)];
    let { loading, error, data } = useQuery<IGetWeekView>(
        GET_WEEK_VIEW,
        {
            displayName: 'GET_WEEK_VIEW',
            variables: { weekNumber: state.weekNumber },
            skip: state.processing,
            fetchPolicy: 'cache-and-network',
        });

    const onChangeWeek = (wn: number) => {
        document.location.hash = `${wn}`;
        setState({ weekNumber: wn });
    };

    let confirmedHours = state.confirmedHours || getValue(data, 'confirmedHours', { default: 0 });
    let matchedEntries = data ? data.result.events.filter(e => e.project).map(e => ({ id: e.id, projectKey: e.project.key })) : [];

    return (
        <>
            <div style={{ marginTop: 10, marginBottom: 10 }}>
                <PrimaryButton
                    text='Confirm week'
                    iconProps={{ iconName: 'CheckMark' }}
                    onClick={async () => {
                        setState({ ...state, processing: true });
                        let { data: { confirmedHours } } = await confirmWeek({ variables: { weekNumber: state.weekNumber, entries: matchedEntries } });
                        setState({ ...state, confirmedHours, processing: false });
                    }}
                    disabled={loading || state.processing || confirmedHours > 0} />
                <DefaultButton
                    style={{ marginLeft: 8 }}
                    text='Unconfirm week'
                    iconProps={{ iconName: 'ErrorBadge' }}
                    onClick={async () => {
                        setState({ ...state, processing: true });
                        await unconfirmWeek({ variables: { weekNumber: state.weekNumber } });
                        setState({ ...state, confirmedHours: 0, processing: false });
                    }}
                    disabled={loading || state.processing || confirmedHours == 0} />
            </div>
            <Pivot
                styles={{ root: { display: 'flex', flexWrap: 'wrap' } }}
                defaultSelectedKey={`${state.weekNumber}`}
                onLinkClick={item => onChangeWeek(parseInt(item.props.itemKey))}>
                {Array.from(Array(weeksToShow).keys()).map(i => {
                    let wn = currentWeekNumber() - (weeksToShow - 1) + i;
                    let isCurrentWeek = wn === state.weekNumber;
                    return (
                        <PivotItem
                            key={i}
                            itemKey={`${wn}`}
                            headerText={`Week ${wn}`}>
                            {isCurrentWeek && (
                                <div style={{ marginTop: 10 }}>
                                    {error && <MessageBar messageBarType={MessageBarType.error}>An error occured. You might have to sign out and sign in again.</MessageBar>}
                                    {data && !loading && (
                                        <WeekStatusBar
                                            totalDuration={data.result.totalDuration}
                                            matchedDuration={data.result.matchedDuration}
                                            confirmedHours={confirmedHours} />
                                    )}
                                    <EventList
                                        enableShimmer={loading || state.processing || confirmedHours > 0}
                                        events={data ? data.result.events : []} />
                                </div>
                            )}
                        </PivotItem>
                    )
                })}
            </Pivot>
        </>
    );
}