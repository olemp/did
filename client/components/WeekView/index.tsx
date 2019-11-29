
import { useMutation, useQuery } from '@apollo/react-hooks';
import * as getValue from 'get-value';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { weekNumber as currentWeekNumber } from 'weeknumber';
import { CONFIRM_WEEK, IConfirmWeek } from './CONFIRM_WEEK';
import { EventList } from './EventList';
import { GET_WEEK_VIEW, IGetWeekView } from './GET_WEEK_VIEW';
import { UNCONFIRM_WEEK } from './UNCONFIRM_WEEK';
import { WeekStatusBar } from './WeekStatusBar';

export const WeekView = ({ weeksToShow }) => {
    let events = [];
    let matchedEvents = [];
    let confirmedHours = 0;
    const initialWeekNumber = document.location.hash ? parseInt(document.location.hash.substring(1)) : currentWeekNumber();
    let [weekNumber, setWeekNumber] = useState<number>(initialWeekNumber);
    let [processing, setProcessing] = useState<boolean>(false);
    const [[confirmWeek], [unconfirmWeek]] = [useMutation<IConfirmWeek>(CONFIRM_WEEK), useMutation(UNCONFIRM_WEEK)];
    let { loading, error, data } = useQuery<IGetWeekView>(
        GET_WEEK_VIEW,
        {
            displayName: 'GET_WEEK_VIEW',
            variables: { weekNumber },
            skip: processing,
            fetchPolicy: 'cache-and-network',
        });

    /**
     * Updates state using setState
     * 
     * @param {number} wn Week number 
     */
    const onChangeWeek = (wn: number) => {
        document.location.hash = `${wn}`;
        setWeekNumber(wn);
    };

    events = getValue(data, 'result.events', { default: [] });
    matchedEvents = events.filter(e => e.project).map(e => ({ id: e.id, projectKey: e.project.key }));
    confirmedHours = getValue(data, 'confirmedHours', { default: 0 });

    return (
        <>
            <div style={{ marginTop: 10, marginBottom: 10 }}>
                <PrimaryButton
                    text='Confirm week'
                    iconProps={{ iconName: 'CheckMark' }}
                    onClick={async () => {
                        setProcessing(true);
                        await confirmWeek({ variables: { weekNumber, entries: matchedEvents } });
                        setProcessing(false);
                    }}
                    disabled={loading || processing || confirmedHours > 0} />
                <DefaultButton
                    style={{ marginLeft: 8 }}
                    text='Unconfirm week'
                    iconProps={{ iconName: 'ErrorBadge' }}
                    onClick={async () => {
                        setProcessing(true);
                        await unconfirmWeek({ variables: { weekNumber } });
                        setProcessing(false);
                    }}
                    disabled={loading || processing || confirmedHours == 0} />
            </div>
            <Pivot
                styles={{ root: { display: 'flex', flexWrap: 'wrap' } }}
                defaultSelectedKey={`${weekNumber}`}
                onLinkClick={item => onChangeWeek(parseInt(item.props.itemKey))}>
                {Array.from(Array(weeksToShow).keys()).map(i => {
                    let wn = currentWeekNumber() - (weeksToShow - 1) + i;
                    let isCurrentWeek = wn === weekNumber;
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
                                    <EventList enableShimmer={loading || processing || confirmedHours > 0} events={events} />
                                </div>
                            )}
                        </PivotItem>
                    )
                })}
            </Pivot>
        </>
    );
}