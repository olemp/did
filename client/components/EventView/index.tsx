
import { PnPClientStorage, PnPClientStore, TypedHash } from '@pnp/common';
import { UserAllocation } from 'components/UserAllocation';
import { getValueTyped as value } from 'helpers';
import { ICalEvent, IProject } from 'models';
import * as moment from 'moment';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as React from 'react';
import * as format from 'string-format';
import { getHash } from 'utils/getHash';
import log from 'utils/log';
import { client as graphql } from '../../graphql';
import { ActionBar } from './ActionBar';
import CONFIRM_WEEK from './CONFIRM_WEEK';
import { EventList } from './EventList';
import { EventOverview } from './EventOverview';
import GET_EVENT_DATA, { IGetEventData } from './GET_EVENT_DATA';
import { Header } from './Header';
import { IEventViewProps } from './IEventViewProps';
import { IEventViewState } from './IEventViewState';
import { PeriodSelector } from './PeriodSelector';
import { StatusBar } from './StatusBar';
import UNCONFIRM_WEEK from './UNCONFIRM_WEEK';
require('moment/locale/en-gb');

export class EventView extends React.Component<IEventViewProps, IEventViewState> {
    private _store: PnPClientStore;
    private _resolvedKey = 'resolved_projects_{0}';

    constructor(props: IEventViewProps) {
        super(props);
        this.state = { period: { weekNumber: getHash({ parseInt: true }) || moment().week() }, selectedView: 'overview' };
        this._store = new PnPClientStorage().local;
    }

    public componentDidMount() {
        this._getEventData(false);
    }

    public render() {
        const { loading, period, isConfirmed, data } = this.state;

        return (
            <div className='c-eventview'>
                <div className='c-eventview-section-container'>
                    <PeriodSelector period={period} onChangePeriod={this._onChangePeriod.bind(this)} />
                    <div className='c-eventview-section-content'>
                        <Header weekNumber={period.weekNumber} />
                        <Pivot defaultSelectedKey={this.state.selectedView} onLinkClick={item => this.setState({ selectedView: item.props.itemKey })}>
                            <PivotItem itemKey='overview' headerText='Overview' itemIcon='CalendarWeek'>
                                <ActionBar
                                    onClick={{
                                        CONFIRM_WEEK: this._onConfirmPeriod.bind(this),
                                        UNCONFIRM_WEEK: this._onUnconfirmPeriod.bind(this),
                                        RELOAD: () => this._getEventData(false),
                                    }}
                                    disabled={{
                                        CONFIRM_WEEK: loading || closed || isConfirmed,
                                        UNCONFIRM_WEEK: loading || closed || !isConfirmed,
                                        RELOAD: loading || closed || isConfirmed,
                                    }}
                                />
                                <StatusBar isConfirmed={isConfirmed} events={value(data, 'events', [])} loading={loading} />
                                <EventList
                                    onProjectSelected={this._onProjectSelected.bind(this)}
                                    onRefetch={this._getEventData.bind(this)}
                                    enableShimmer={loading}
                                    events={value(data, 'events', [])}
                                    dateFormat='HH:mm'
                                    isConfirmed={isConfirmed || closed}
                                    groups={{ fieldName: 'day', groupNames: moment.weekdays(true) }} />
                            </PivotItem>
                            <PivotItem itemKey='summary' headerText='Summary' itemIcon='List'>
                                <EventOverview events={value(data, 'events', [])} enableShimmer={loading} weekNumber={period.weekNumber} />
                            </PivotItem>
                            <PivotItem itemKey='allocation' headerText='Allocation' itemIcon='ReportDocument'>
                                <UserAllocation entries={value(data, 'events', [])} charts={{ 'project.name': 'Allocation per project', 'customer.name': 'Allocation per customer' }} />
                            </PivotItem>
                        </Pivot>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * On project selected
     *
    * @param {ICalEvent} event Event
    * @param {IProject} project Project
    */
    private _onProjectSelected(event: ICalEvent, project: IProject) {
        this._storeResolve(event.id, project);
        this.setState(prevState => ({
            data: {
                ...prevState.data,
                events: prevState.data.events.map(e => {
                    if (e.id === event.id) {
                        e.project = project;
                        e.customer = project.customer;
                    }
                    return e;
                })
            }
        }));
    }

    /**
    * On change period
    *
    * @param {any} _event Event
    */
    private _onChangePeriod(item: PivotItem) {
        let weekNumber = parseInt(item.props.itemKey);
        document.location.hash = `w${weekNumber}`;
        this.setState({ period: { weekNumber } }, () => this._getEventData(false));
    };

    /**
     * On unconfirm period
     */
    private async _onConfirmPeriod() {
        this.setState({ loading: true });
        const entries = this.state.data.events
            .filter(event => !!event.project)
            .map(event => ({ id: event.id, projectId: event.project.id }));
        const variables = { weekNumber: this.state.period.weekNumber, entries };
        await graphql.mutate({ mutation: CONFIRM_WEEK, variables });
        log.info('_onConfirmWeek');
        await this._getEventData();
    };

    /**
     * On unconfirm period
     */
    private async _onUnconfirmPeriod() {
        this._clearResolve();
        this.setState({ loading: true });
        await graphql.mutate({ mutation: UNCONFIRM_WEEK, variables: { weekNumber: this.state.period.weekNumber } });
        log.info('_onUnconfirmWeek')
        await this._getEventData();

    };

    /**
     * Get stored resolves from local storage
     *
    * @param {string} eventId Event id
    */
    private _getStoredResolves(eventId?: string): TypedHash<IProject> {
        let storedResolves = this._store.get(format(this._resolvedKey, this.state.period.weekNumber));
        if (!storedResolves) return {};
        if (eventId && storedResolves[eventId]) return storedResolves[eventId];
        return storedResolves;
    }

    /**
     * Store resolve in local storage
     *
    * @param {string} eventId Event id
    * @param {IProject} project Project
    */
    private _storeResolve(eventId: string, project: IProject) {
        let resolves = this._getStoredResolves();
        resolves[eventId] = project;
        this._store.put(format(this._resolvedKey, this.state.period.weekNumber), resolves);
    }

    /**
     * Clear resolve
     */
    private _clearResolve() {
        this._store.put(format(this._resolvedKey, this.state.period.weekNumber), {});
    }

    /**
     * Get event data for week number
     *
    * @param {boolean} skipLoading Skips setting loading in state
    */
    private async _getEventData(skipLoading: boolean = true) {
        if (!skipLoading) this.setState({ loading: true });
        const { data: { eventData, weeks } } = await graphql.query({
            query: GET_EVENT_DATA,
            variables: this.state.period,
            fetchPolicy: 'network-only',
        });
        let data: IGetEventData = { ...eventData, weeks };
        let isConfirmed = data.confirmedDuration > 0
        let resolves = this._getStoredResolves();
        data.events = data.events
            .map(event => {
                event.day = moment(event.startTime).format('dddd');
                if (resolves[event.id]) {
                    event.project = resolves[event.id];
                    event.customer = resolves[event.id].customer;
                }
                return event;
            });
        this.setState({ data, loading: false, isConfirmed });
    }
}