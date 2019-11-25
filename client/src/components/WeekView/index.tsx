
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
import * as moment from 'moment';
import { ICalEvent } from "../../models";
import graphql from '../../data/graphql';
require('moment/locale/en-gb');

export class WeekView extends React.Component<IWeekViewProps, IWeekViewState> {
    constructor(props: IWeekViewProps) {
        super(props);
        this.state = {
            isLoading: true,
            events: [],
            weekNumber: weekNumber(),
        };
    }

    public componentWillUpdate(nextProps: IWeekViewProps, nextState: IWeekViewState) {
        document.location.hash = `${nextState.weekNumber}`;
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
            return <Spinner label='Loading your week from Outlook....' />;
        }

        return (
            <>
                <Actions onConfirmWeek={this._onConfirmWeek.bind(this)} />
                <WeekConfirmedMessage hidden={!this.state.isConfirmed} totalDuration={this.state.totalDuration} />
                <div hidden={!this.state.isConfirming}>
                    <Spinner label='Confirming the week....' />
                </div>
                <Pivot
                    styles={{ root: { display: 'flex', flexWrap: 'wrap' } }}
                    defaultSelectedKey={`${this.state.weekNumber}`}
                    onLinkClick={item => this._onChangeWeek(parseInt(item.props.itemKey))}>
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

    /**
     * On change week
     * 
     * @param {number} weekNumber Week number
     */
    private async _onChangeWeek(weekNumber: number) {
        if (weekNumber === this.state.weekNumber) return;
        let { events, totalDuration, matchedDuration } = await this._getEvents(weekNumber);
        this.setState({
            events,
            totalDuration,
            matchedDuration,
            weekNumber,
            isConfirmed: false,
        });
    }

    /**
     * On confirm week
     */
    private async _onConfirmWeek() {
        this.setState({ isConfirming: true });
        window.setTimeout(() => { this.setState({ isConfirming: false, isConfirmed: true }); }, 2500);
    }

    /**
     * Get events for week number
     * 
     * @param {number} weekNumber Week number
     */
    private async _getEvents(weekNumber: number): Promise<Partial<IWeekViewState>> {
        let { weekView: events } = await graphql.query<{ weekView: any[] }>('query($weekNumber: Int!){weekView(weekNumber: $weekNumber){id,subject,webLink,duration,startTime,endTime,project{key,name}}}', { weekNumber });
        let calcDuration = (total: number, e: ICalEvent) => total + e.duration;
        return {
            events,
            matchedDuration: events.filter(e => e.project).reduce(calcDuration, 0),
            totalDuration: events.reduce(calcDuration, 0),
        }
    }
}