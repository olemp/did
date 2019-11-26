
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import * as React from 'react';
import { weekNumber } from 'weeknumber';
import graphql from '../../data/graphql';
import { ICalEvent } from "../../models";
import { Actions } from './Actions';
import { ConfirmingWeekSpinner } from './ConfirmingWeekSpinner';
import { EventList } from './EventList';
import { IWeekViewProps, WeekViewDefaultProps } from './IWeekViewProps';
import { IWeekViewState } from './IWeekViewState';
import { WeekConfirmedMessage } from './WeekConfirmedMessage';
import { WeekStatusBar } from './WeekStatusBar';
import { getUrlParameter } from 'helpers';
require('moment/locale/en-gb');

export class WeekView extends React.Component<IWeekViewProps, IWeekViewState> {
    public static defaultProps = WeekViewDefaultProps;

    constructor(props: IWeekViewProps) {
        super(props);
        this.state = {
            isLoading: true,
            events: [],
            weekNumber: document.location.hash ? parseInt(document.location.hash.substring(1)) : weekNumber(),
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
                                        <div hidden={!this.state.isLoading}>
                                            <Spinner label={this.props.loadingText} />
                                        </div>
                                        <div hidden={this.state.isLoading}>
                                            <div hidden={this.state.isConfirmed || this.state.isConfirming}>
                                                <WeekStatusBar totalDuration={this.state.totalHours} matchedDuration={this.state.matchedHours} />
                                                <EventList events={this.state.events} />
                                            </div>
                                            <WeekConfirmedMessage hidden={!this.state.isConfirmed} confirmedHours={this.state.confirmedHours} />
                                        </div>
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
        this.setState({ isLoading: true, weekNumber });
        const week = await this._getWeek(weekNumber);
        this.setState({
            ...week,
            weekNumber,
            isLoading: false,
        });
    }

    /**
     * On confirm week
     */
    private async _onConfirmWeek() {
        const { events, weekNumber } = this.state;
        this.setState({ isConfirming: true });
        const entries = events.filter(e => e.project).map(e => ({ id: e.id, projectKey: e.project.key }));
        let { confirmWeek: confirmedHours } = await graphql.query<{ confirmWeek: number }>('mutation($entries:[TimeEntryInput!],$weekNumber: Int!){confirmWeek(entries: $entries,weekNumber: $weekNumber)}', { entries, weekNumber });
        this.setState({
            isConfirming: false,
            isConfirmed: confirmedHours != 0,
            confirmedHours,
        });
    }

    /**
     * On unconfirm week
     */
    private async _onUnconfirmWeek() {
        const { weekNumber } = this.state;
        await graphql.query<{ confirmWeek: boolean }>('mutation($weekNumber: Int!){unconfirmWeek(weekNumber: $weekNumber)}', { weekNumber });
        this.setState({ isConfirmed: false });
    }

    /**
     * Get events for week number
     * 
     * @param {number} weekNumber Week number
     */
    private async _getWeek(weekNumber: number): Promise<Partial<IWeekViewState>> {
        const { weekView: events, confirmedHours, errors } = await graphql.usingCaching(true, 15).query<any>(this.props.graphqlquery, { weekNumber });
        if (errors) {
            console.log(errors);
        } else {
            let calcDuration = (total: number, e: ICalEvent) => total + e.duration;
            return {
                events,
                isConfirmed: confirmedHours != 0,
                confirmedHours,
                matchedHours: events.filter(e => e.project).reduce(calcDuration, 0),
                totalHours: events.reduce(calcDuration, 0),
            }
        }
    }
}