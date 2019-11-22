
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import * as React from 'react';
import { weekNumber } from 'weeknumber';
import { Actions } from './Actions';
import { EventList } from './EventList';
import { IWeekViewProps } from './IWeekViewProps';
import { IWeekViewState } from './IWeekViewState';
import { WeekConfirmedMessage } from './WeekConfirmedMessage';
import { WeekStatusBar } from './WeekStatusBar';

export class WeekView extends React.Component<IWeekViewProps, IWeekViewState> {
    constructor(props: IWeekViewProps) {
        super(props);
        this.state = {
            isLoading: true,
            events: [],
            weekNumber: weekNumber(),
        };
    }

    public async componentDidMount(): Promise<void> {
        let { events, totalDuration, matchedDuration } = await this._getEvents(this.state.weekNumber);
        this.setState({
            events,
            totalDuration,
            matchedDuration,
            isLoading: false,
        });
    }

    public render() {
        if (this.state.isLoading) {
            return <Spinner label='Loading your week....' />;
        }

        return (
            <>
                <Actions onConfirmWeek={this._onConfirmWeek.bind(this)} />
                <WeekConfirmedMessage hidden={!this.state.isConfirmed} totalDuration={this.state.totalDuration} />
                <div hidden={!this.state.isConfirming}>
                    <Spinner label='Confirming the week....' />
                </div>
                <Pivot defaultSelectedKey={`${this.state.weekNumber}`} onLinkClick={this._onChangeWeek.bind(this)}>
                    {Array.from(Array(this.props.weeksToShow).keys()).map(i => {
                        let wn = weekNumber() - (this.props.weeksToShow - 1) + i;
                        return (
                            <PivotItem
                                key={i}
                                itemKey={`${wn}`}
                                headerText={`Week ${wn}`}>
                                {wn === this.state.weekNumber && (
                                    <div hidden={this.state.isConfirmed || this.state.isConfirming}>
                                        <WeekStatusBar totalDuration={this.state.totalDuration} matchedDuration={this.state.matchedDuration} />
                                        <EventList events={this.state.events} />
                                    </div>
                                )}
                            </PivotItem>
                        )
                    })}
                </Pivot>
            </>
        );
    }

    private async _onChangeWeek(item: PivotItem) {
        let weekNumber = parseInt(item.props.itemKey);
        let { events, totalDuration, matchedDuration } = await this._getEvents(weekNumber);
        this.setState({ events, totalDuration, matchedDuration, weekNumber });
    }

    private _onConfirmWeek() {
        this.setState({ isConfirming: true });
        window.setTimeout(() => {
            this.setState({ isConfirming: false, isConfirmed: true });
        }, 7000);
    }

    private async _getEvents(weekNumber: number): Promise<Partial<IWeekViewState>> {
        let events: ICalEvent[] = await (await fetch(`/api/events?weekNumber=${weekNumber}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })).json();
        return {
            events,
            matchedDuration: events.filter(e => e.project).reduce((total: number, e: any) => total + e.duration, 0),
            totalDuration: events.reduce((total: number, e: any) => total + e.duration, 0),
        }
    }
}