
import { PnPClientStorage, PnPClientStore, TypedHash } from '@pnp/common';
import { UserAllocation } from 'components/UserAllocation';
import { getValueTyped as value } from 'helpers';
import { ICalEvent, IProject } from 'models';
import * as moment from 'moment';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import * as React from 'react';
import * as format from 'string-format';
import { getHash } from 'utils/getHash';
import { client as graphql } from '../../graphql';
import { ActionBar, GROUP_BY_DAY } from './ActionBar';
import CONFIRM_WEEK from './CONFIRM_WEEK';
import { EventList } from './EventList';
import { EventOverview } from './EventOverview';
import GET_EVENT_DATA, { IGetEventData } from './GET_EVENT_DATA';
import { IEventViewProps } from './IEventViewProps';
import { IEventViewState } from './IEventViewState';
import { StatusBar } from './StatusBar';
import UNCONFIRM_WEEK from './UNCONFIRM_WEEK';
require('moment/locale/en-gb');

/**
 * @component EventView
 * @description 
 */
export class EventView extends React.Component<IEventViewProps, IEventViewState> {
    private _store: PnPClientStore;
    private _resolvedKey = 'resolved_projects_{0}';

    constructor(props: IEventViewProps) {
        super(props);
        this.state = {
            weekNumber: getHash({ parseInt: true }) || moment().week(),
            selectedView: 'overview',
            groupBy: GROUP_BY_DAY,
        };
        this._store = new PnPClientStorage().local;
    }

    public componentDidMount() {
        this._getEventData(false);
    }

    public render() {
        const { loading, weekNumber, groupBy, isConfirmed, data } = this.state;

        return (
            <div className='c-eventview'>
                <div className='c-eventview-section-container'>
                    <div className='c-eventview-section-content'>
                        <Pivot defaultSelectedKey={this.state.selectedView} onLinkClick={item => this.setState({ selectedView: item.props.itemKey })}>
                            <PivotItem itemKey='overview' headerText='Overview' itemIcon='CalendarWeek'>
                                <ActionBar
                                    weekNumber={weekNumber}
                                    groupBy={groupBy}
                                    onChangeWeek={this._onChangeWeek.bind(this)}
                                    onGroupByChanged={this._onGroupByChanged.bind(this)}
                                    onClick={{
                                        CONFIRM_WEEK: this._onConfirmWeek.bind(this),
                                        UNCONFIRM_WEEK: this._onUnconfirmWeek.bind(this),
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
                                    dateFormat={groupBy.data.dateFormat}
                                    isLocked={isConfirmed || closed}
                                    hideColumns={groupBy.data.hideColumns}
                                    groups={groupBy.data.groups} />
                            </PivotItem>
                            <PivotItem itemKey='summary' headerText='Summary' itemIcon='List'>
                                <EventOverview
                                    events={value(data, 'events', [])}
                                    enableShimmer={loading}
                                    weekNumber={weekNumber} />
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
    * On change week
    *
    * @param {number} weekNumber Week number
    */
    private _onChangeWeek(weekNumber: number) {
        if (weekNumber === this.state.weekNumber) return;
        document.location.hash = `w${weekNumber}`;
        this.setState({ weekNumber }, () => this._getEventData(false));
    };

    /**
     * On group by changed
     * 
     * @param {IContextualMenuItem} groupBy Group by
     */
    private _onGroupByChanged(groupBy: IContextualMenuItem) {
        this.setState({ groupBy });
    }

    /**
     * On confirm week
     */
    private async _onConfirmWeek() {
        this.setState({ loading: true });
        const entries = this.state.data.events
            .filter(event => !!event.project)
            .map(event => ({ id: event.id, projectId: event.project.id }));
        const variables = { weekNumber: this.state.weekNumber, entries };
        await graphql.mutate({ mutation: CONFIRM_WEEK, variables });
        await this._getEventData();
    };

    /**
     * On unconfirm week
     */
    private async _onUnconfirmWeek() {
        this._clearResolve();
        this.setState({ loading: true });
        await graphql.mutate({ mutation: UNCONFIRM_WEEK, variables: { weekNumber: this.state.weekNumber } });
        await this._getEventData();

    };

    /**
     * Get stored resolves from local storage
     *
    * @param {string} eventId Event id
    */
    private _getStoredResolves(eventId?: string): TypedHash<IProject> {
        let storedResolves = this._store.get(format(this._resolvedKey, this.state.weekNumber));
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
        this._store.put(format(this._resolvedKey, this.state.weekNumber), resolves);
    }

    /**
     * Clear resolve
     */
    private _clearResolve() {
        this._store.put(format(this._resolvedKey, this.state.weekNumber), {});
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
            variables: { weekNumber: this.state.weekNumber },
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