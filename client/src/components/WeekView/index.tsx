
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import * as React from 'react';
import { weekNumber } from 'weeknumber';
import graphql from '../../data/graphql';
import { ICalEvent } from "../../models";
import { Actions } from './Actions';
import { ConfirmingWeekSpinner } from './ConfirmingWeekSpinner';
import { EventList } from './EventList';
import { IWeekViewProps } from './IWeekViewProps';
import { IWeekViewState } from './IWeekViewState';
import { WeekConfirmedMessage } from './WeekConfirmedMessage';
import { WeekStatusBar } from './WeekStatusBar';
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

    public componentWillUpdate(_nextProps: IWeekViewProps, nextState: IWeekViewState) {
        document.location.hash = `${nextState.weekNumber}`;
    }

    public async componentDidMount(): Promise<void> {
        let week = await this._getWeek(this.state.weekNumber);
        this.setState({ ...week, isLoading: false });
    }

    public render() {
        if (this.state.isLoading) {
            return <Spinner label='Loading your week from Outlook....' />;
        }

        return (
            <>
                <Actions
                    onConfirmWeek={this._onConfirmWeek.bind(this)}
                    onUnconfirmWeek={this._onUnconfirmWeek.bind(this)}
                    onConfirmWeekEnabled={!this.state.isConfirmed}
                    onUnconfirmWeekEnabled={this.state.isConfirmed} />
                <ConfirmingWeekSpinner hidden={!this.state.isConfirming} />
                <Pivot
                    hidden={this.state.isConfirming}
                    styles={{ root: { display: 'flex', flexWrap: 'wrap' } }}
                    defaultSelectedKey={`${this.state.weekNumber}`}
                    onLinkClick={item => this._onChangeWeek(parseInt(item.props.itemKey))}>
                    {Array.from(Array(this.props.weeksToShow).keys()).map(i => {
                        let wn = weekNumber() - (this.props.weeksToShow - 1) + i;
                        let isCurrentWeek = wn === this.state.weekNumber;
                        return (
                            <PivotItem
                                key={i}
                                itemKey={`${wn}`}
                                headerText={`Week ${wn}`}>
                                {isCurrentWeek && (
                                    <>
                                        <div hidden={this.state.isConfirmed || this.state.isConfirming}>
                                            <WeekStatusBar totalDuration={this.state.totalDuration} matchedDuration={this.state.matchedDuration} />
                                            <EventList events={this.state.events} />
                                        </div>
                                        <WeekConfirmedMessage hidden={!this.state.isConfirmed} totalDuration={this.state.totalDuration} />
                                    </>
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
        let { events, totalDuration, matchedDuration } = await this._getWeek(weekNumber);
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
        const { events, weekNumber } = this.state;
        this.setState({ isConfirming: true });
        const entries = events.filter(e => e.project).map(e => ({ id: e.id, projectKey: e.project.key }));
        let { approveWeek } = await graphql.query<{ approveWeek: boolean }>('mutation($entries:[TimeEntryInput!],$weekNumber: Int!){approveWeek(entries: $entries,weekNumber: $weekNumber)}', { entries, weekNumber });
        this.setState({ isConfirming: false, isConfirmed: approveWeek });
    }

    /**
     * On unconfirm week
     */
    private async _onUnconfirmWeek() { }

    /**
     * Get events for week number
     * 
     * @param {number} weekNumber Week number
     */
    private async _getWeek(weekNumber: number): Promise<Partial<IWeekViewState>> {
        const { weekView: events, isWeekConfirmed: isConfirmed, errors } = await graphql.query<any>('query($weekNumber: Int!){isWeekConfirmed(weekNumber: $weekNumber) weekView(weekNumber: $weekNumber){id,subject,webLink,duration,startTime,endTime,project{key,name}}}', { weekNumber });
        if (errors) {
            console.log(errors);
        } else {
            let calcDuration = (total: number, e: ICalEvent) => total + e.duration;
            return {
                events,
                isConfirmed,
                matchedDuration: events.filter(e => e.project).reduce(calcDuration, 0),
                totalDuration: events.reduce(calcDuration, 0),
            }
        }
    }
}