
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import * as React from 'react';
import { weekNumber as currentWeekNumber } from 'weeknumber';
import graphql from '../../data/graphql';
import { ICalEvent } from "../../models";
import { Actions } from './Actions';
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
            spinner: { label: 'Loading your week from Outlook....' },
            events: [],
            weekNumber: document.location.hash ? parseInt(document.location.hash.substring(1)) : currentWeekNumber(),
        };
    }

    public componentWillUpdate(_nextProps: IWeekViewProps, nextState: IWeekViewState) {
        document.location.hash = `${nextState.weekNumber}`;
    }

    public async componentDidMount(): Promise<void> {
        let week = await this._getWeek(this.state.weekNumber);
        this.setState({ ...week, isLoading: false, spinner: null });
    }

    public render() {
        const {
            isLoading,
            spinner,
            events,
            isConfirmed,
            weekNumber,
            totalHours,
            matchedHours,
            confirmedHours,
        } = this.state;
        return (
            <>
                <Actions
                    onConfirmWeek={this._onConfirmWeek.bind(this)}
                    onUnconfirmWeek={this._onUnconfirmWeek.bind(this)}
                    onConfirmWeekEnabled={!isConfirmed && !isLoading}
                    onUnconfirmWeekEnabled={isConfirmed && !isLoading} />
                <Pivot
                    styles={{ root: { display: 'flex', flexWrap: 'wrap' } }}
                    defaultSelectedKey={`${weekNumber}`}
                    onLinkClick={item => this._onChangeWeek(parseInt(item.props.itemKey))}>
                    {Array.from(Array(this.props.weeksToShow).keys()).map(i => {
                        let wn = currentWeekNumber() - (this.props.weeksToShow - 1) + i;
                        let isCurrentWeek = wn === weekNumber;
                        return (
                            <PivotItem
                                key={i}
                                itemKey={`${wn}`}
                                headerText={`Week ${wn}`}>
                                {isCurrentWeek && (
                                    <div style={{ marginTop: 10 }}>
                                        {spinner && <Spinner {...spinner} />}
                                        <div hidden={isLoading}>
                                            <div hidden={isConfirmed || !!spinner}>
                                                <WeekStatusBar totalDuration={totalHours} matchedDuration={matchedHours} />
                                                <EventList events={events} />
                                            </div>
                                            <WeekConfirmedMessage hidden={!isConfirmed} confirmedHours={confirmedHours} />
                                        </div>
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
        this.setState({
            isLoading: true,
            spinner: { label: 'Loading your week from Outlook....' },
            weekNumber,
        });
        const week = await this._getWeek(weekNumber);
        this.setState({
            isLoading: false,
            spinner: null,
            ...week,
            weekNumber,
        });
    }

    /**
     * On confirm week
     */
    private async _onConfirmWeek() {
        const { events, weekNumber } = this.state;
        this.setState({ spinner: { label: 'Confirming the week....' } });
        const entries = events.filter(e => e.project).map(e => ({ id: e.id, projectKey: e.project.key }));
        let { confirmWeek: confirmedHours } = await graphql.query<{ confirmWeek: number }>('mutation($entries:[TimeEntryInput!],$weekNumber: Int!){confirmWeek(entries: $entries,weekNumber: $weekNumber)}', { entries, weekNumber });
        this.setState({
            spinner: null,
            isConfirmed: confirmedHours != 0,
            confirmedHours,
        });
    }

    /**
     * On unconfirm week
     */
    private async _onUnconfirmWeek() {
        const { weekNumber } = this.state;
        this.setState({ spinner: { label: 'Unconfirming the week....' } });
        await graphql.query('mutation($weekNumber: Int!){unconfirmWeek(weekNumber: $weekNumber)}', { weekNumber });
        this.setState({ spinner: null });
    }

    /**
     * Get events for week number
     * 
     * @param {number} weekNumber Week number
     */
    private async _getWeek(weekNumber: number): Promise<Partial<IWeekViewState>> {
        const { weekView: events, confirmedHours, errors } = await graphql.usingCaching(false).query<any>(this.props.graphqlquery, { weekNumber });
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