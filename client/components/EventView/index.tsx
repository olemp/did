
import { UserAllocation } from 'components/UserAllocation';
import { UserMessage } from 'components/UserMessage';
import { ICalEvent, IProject } from 'models';
import * as moment from 'moment';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { IPivotItemProps, Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as React from 'react';
import log from 'utils/log';
import { client as graphql } from '../../graphql';
import { ActionBar } from './ActionBar';
import CONFIRM_WEEK from './CONFIRM_WEEK';
import { EventList } from './EventList';
import GET_EVENT_DATA, { IGetEventData } from './GET_EVENT_DATA';
import { Header } from './Header';
import { IEventViewProps } from './IEventViewProps';
import { IEventViewState } from './IEventViewState';
import { StatusBar } from './StatusBar';
import UNCONFIRM_WEEK from './UNCONFIRM_WEEK';
import { getHash } from 'utils/getHash';
require('moment/locale/en-gb');

export class EventView extends React.Component<IEventViewProps, IEventViewState> {
    constructor(props: IEventViewProps) {
        super(props);
        this.state = {
            weekNumber: getHash({ parseInt: true }) || moment().week(),
            data: { events: [], weeks: [] },
            selectedView: 'overview'
        };
    }

    public componentDidMount() {
        this._getEventData(false);
    }

    public render() {
        const { loading, weekNumber, isConfirmed, data } = this.state;

        return (
            <div className='c-eventview'>
                <Pivot
                    className='c-eventview-section-container'
                    styles={{ root: { display: 'flex', flexWrap: 'wrap' } }}
                    defaultSelectedKey={weekNumber.toString()}
                    onLinkClick={this._onChangeWeek.bind(this)}>
                    {this._getSections().map(({ props, renderView, closed }) => (
                        <PivotItem {...props}>
                            <div className='c-eventview-section-content'>
                                {closed && <UserMessage text='This week has been closed by an administrator.' iconName='LockSolid' type={0} />}
                                {renderView && (
                                    <>
                                        <Header weekNumber={weekNumber} />
                                        <Pivot defaultSelectedKey={this.state.selectedView} onLinkClick={item => this.setState({ selectedView: item.props.itemKey })}>
                                            <PivotItem itemKey='overview' headerText='Overview' itemIcon='CalendarWeek'>
                                                <ActionBar
                                                    onClick={{
                                                        CONFIRM_PERIOD: this._onConfirmWeek.bind(this),
                                                        UNCONFIRM_PERIOD: this._onUnconfirmWeek.bind(this),
                                                        RELOAD: () => window.location.reload(),
                                                    }}
                                                    disabled={{
                                                        CONFIRM_PERIOD: loading || isConfirmed,
                                                        UNCONFIRM_PERIOD: loading || !isConfirmed,
                                                    }}
                                                />
                                                <StatusBar isConfirmed={isConfirmed} data={data} loading={loading} />
                                                <EventList
                                                    onProjectSelected={this._onProjectSelected.bind(this)}
                                                    onRefetch={this._getEventData.bind(this)}
                                                    enableShimmer={loading}
                                                    events={data.events}
                                                    dateFormat='HH:mm'
                                                    isConfirmed={isConfirmed}
                                                    groups={{ fieldName: 'day', groupNames: moment.weekdays(true) }} />
                                            </PivotItem>
                                            <PivotItem itemKey='allocation' headerText='Allocation' itemIcon='ReportDocument'>
                                                <UserAllocation
                                                    entries={data.events}
                                                    charts={{ 'project.name': 'Allocation per project', 'customer.name': 'Allocation per customer' }} />
                                            </PivotItem>
                                        </Pivot>
                                    </>
                                )}
                            </div>
                        </PivotItem>
                    ))}
                </Pivot>
            </div>
        )
    }

    /**
     * On project selected
     * 
     * @param {ICalEvent} event Event
     * @param {IProject} project Project
     */
    private _onProjectSelected(event: ICalEvent, project: IProject) {
        this.setState(prevState => ({
            data: {
                ...prevState.data,
                events: prevState.data.events.map(e => {
                    if (e.id === event.id) e.project = project;
                    return e;
                })
            }
        }));
    }

    /**
     * Custom renderer for for item link
     * 
     * @param {IPivotItemProps} props Props
     * @param {Function} defaultRender Default render method
     * @param {boolean} locked Is locked (renders a lock icon next to it)
     */
    private _onRenderItemLink(props: IPivotItemProps, defaultRender: (props: IPivotItemProps) => JSX.Element) {
        return (
            <span>
                <Icon iconName='LockSolid' styles={{ root: { marginRight: 4 } }} hidden={!props.headerButtonProps.disabled} />
                {defaultRender(props)}
            </span>
        );
    }

    /**
     * Get sections
     * 
     * @param {number} count Number of sections
     */
    private _getSections(count: number = 10): { props: IPivotItemProps, renderView: boolean, closed: boolean }[] {
        return Array.from(Array(count).keys())
            .map(i => moment().week() - (count - 1) + i)
            .map(wn => {
                let closed = this.state.data.weeks.filter(w => w.id === wn.toString() && w.closed).length === 1;
                let renderView = (wn === this.state.weekNumber) && !closed;
                return {
                    props: {
                        key: wn.toString(),
                        itemKey: wn.toString(),
                        headerText: `Week ${wn}`,
                        headerButtonProps: { disabled: closed },
                        onRenderItemLink: this._onRenderItemLink.bind(this),
                    },
                    renderView,
                    closed,
                }
            });
    }

    /**
     * On change week
     * 
     * @param {PivotItem} item The item
     */
    private _onChangeWeek(item: PivotItem) {
        let weekNumber = parseInt(item.props.itemKey);
        document.location.hash = `w${weekNumber}`;
        this.setState({ weekNumber }, () => this._getEventData(false));
    };

    /**
     * On unconfirm wek
     */
    private async _onConfirmWeek() {
        this.setState({ loading: true });
        const entries = this.state.data.matchedEvents.map(e => ({ id: e.id, projectId: e.project.id }));
        const variables = { weekNumber: this.state.weekNumber, entries };
        let { data: { result } } = await graphql.mutate({ mutation: CONFIRM_WEEK, variables });
        log.info('_onConfirmWeek', result.error);
        await this._getEventData(false);
    };

    /**
     * On unconfirm week
     */
    private async _onUnconfirmWeek() {
        this.setState({ loading: true });
        let { data: { result } } = await graphql.mutate({ mutation: UNCONFIRM_WEEK, variables: { weekNumber: this.state.weekNumber } });
        log.info('_onUnconfirmWeek', result.error)
        await this._getEventData(false);

    };

    /**
     * Get event data for week number
     * 
     * @param {boolean} skipLoading Skips setting loading in state
     * @param {any} fetchPolicy Fetch policy
     */
    private async _getEventData(skipLoading: boolean = true, fetchPolicy: any = 'network-only') {
        if (!skipLoading) this.setState({ loading: true });
        const { data: { event_data, weeks } } = await graphql.query({
            query: GET_EVENT_DATA,
            variables: { weekNumber: this.state.weekNumber },
            fetchPolicy,
        });
        let data: IGetEventData = { ...event_data, weeks };
        let isConfirmed = data.confirmedDuration > 0
        data.events = data.events.map(e => ({ ...e, day: moment(e.startTime).format('dddd') }));
        this.setState({ data, loading: false, isConfirmed });
    }
}