
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
import * as React from 'react';
import { weekNumber as currentWeekNumber } from 'weeknumber';
import { Actions } from './Actions';
import { EventList } from './EventList';
import { WeekStatusBar } from './WeekStatusBar';

export const GET_WEEK_VIEW = gql`
    query($weekNumber: Int!) {
        confirmedHours(weekNumber: $weekNumber) 
        weekView(weekNumber: $weekNumber) {
            events {
                id,
                title,
                webLink,
                durationMinutes,
                startTime,
                endTime,
                project {
                    key,
                    name
                }
            },
            totalDuration,
            matchedDuration,
        }
    }
`;

export const WeekView2 = ({ weeksToShow }) => {
    const initialWeekNumber = document.location.hash ? parseInt(document.location.hash.substring(1)) : currentWeekNumber();
    let [[weekNumber, setWeekNumber], [confirmedHours, setConfirmedHours]] = [
        React.useState(initialWeekNumber),
        React.useState(undefined),
    ];
    let { loading, error, data } = useQuery(GET_WEEK_VIEW, { variables: { weekNumber } });

    confirmedHours = confirmedHours != undefined ? confirmedHours : (data && data.confirmedHours);
    let weekConfirmed = confirmedHours > 0;

    const onChangeWeek = (wn: number) => {
        document.location.hash = `${wn}`;
        setWeekNumber(wn);
    };

    return (
        <>
            <Actions
                weekView={data && data.weekView}
                weekNumber={weekNumber}
                onConfirmWeekEnabled={!weekConfirmed && !loading}
                onUnconfirmWeekEnabled={weekConfirmed && !loading}
                onSetConfirmedHours={setConfirmedHours} />
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
                                    {loading && <Shimmer />}
                                    {error && <MessageBar messageBarType={MessageBarType.error}>An error occured.</MessageBar>}
                                    {data && !loading && (
                                        <WeekStatusBar
                                            weekConfirmed={weekConfirmed}
                                            totalDuration={data.weekView.totalDuration}
                                            matchedDuration={data.weekView.matchedDuration}
                                            confirmedHours={confirmedHours} />
                                    )}
                                    <EventList
                                        hidden={weekConfirmed}
                                        enableShimmer={loading}
                                        events={data ? data.weekView.events : []} />
                                </div>
                            )}
                        </PivotItem>
                    )
                })}
            </Pivot>
        </>
    );
}