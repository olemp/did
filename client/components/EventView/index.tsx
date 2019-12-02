
import { UserMessage } from 'components/UserMessage';
import * as moment from 'moment';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { IPivotItemProps, Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as React from 'react';
import { getHash } from 'utils/getHash';
import log from 'utils/log';
import { client as graphql } from '../../graphql';
import { ConfirmButton } from './ConfirmButton';
import CONFIRM_WEEK from './CONFIRM_WEEK';
import { EventList } from './EventList';
import GET_EVENT_DATA, { IGetEventData } from './GET_EVENT_DATA';
import { IEventViewProps } from './IEventViewProps';
import { IEventViewState } from './IEventViewState';
import { StatusBar } from './StatusBar';
import { UnconfirmButton } from './UnconfirmButton';
import UNCONFIRM_WEEK from './UNCONFIRM_WEEK';
import { IProject, ICalEvent } from 'models';
require('moment/locale/en-gb');

export class EventView extends React.Component<IEventViewProps, IEventViewState> {
    constructor(props: IEventViewProps) {
        super(props);
        this.state = { weekNumber: getHash({ parseInt: true }) || moment().week(), data: { events: [], weeks: [] } };
    }

    public componentDidMount() {
        this._getEventData();
    }

    public render() {
        const { loading, weekNumber, isConfirmed, data } = this.state;

        return (
            <div className='c-eventview'>
                <div className='c-eventview-actions'>
                    <ConfirmButton onClick={this._onConfirmWeek.bind(this)} disabled={loading || isConfirmed} />
                    <UnconfirmButton onClick={this._onUnconfirmWeek.bind(this)} disabled={loading || !isConfirmed} />
                </div>
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
                                        <StatusBar isConfirmed={isConfirmed} data={data} loading={loading} />
                                        <EventList
                                            onProjectSelected={this._onProjectSelected.bind(this)}
                                            onRefetch={() => this._getEventData(undefined, true)}
                                            enableShimmer={loading}
                                            events={data.events}
                                            isConfirmed={isConfirmed} />
                                    </>
                                )}
                            </div>
                        </PivotItem>
                    ))}
                </Pivot>
            </div>
        )
    }

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
     */
    private _getSections(): { props: IPivotItemProps, renderView: boolean, closed: boolean }[] {
        return Array.from(Array(10).keys())
            .map(i => moment().week() - (10 - 1) + i)
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
        this._getEventData(weekNumber);
    };

    /**
     * On unconfirm wek
     */
    private async _onConfirmWeek() {
        this.setState({ loading: true });
        const entries = this.state.data.matchedEvents.map(e => ({ id: e.id, projectKey: e.project.key }));
        const variables = { weekNumber: this.state.weekNumber, entries };
        let { data: { result } } = await graphql.mutate({ mutation: CONFIRM_WEEK, variables });
        log.info('_onConfirmWeek', result.error);
        await this._getEventData();
    };

    /**
     * On unconfirm week
     */
    private async _onUnconfirmWeek() {
        this.setState({ loading: true });
        let { data: { result } } = await graphql.mutate({ mutation: UNCONFIRM_WEEK, variables: { weekNumber: this.state.weekNumber } });
        log.info('_onUnconfirmWeek', result.error)
        await this._getEventData();

    };

    /**
     * Get event data for week number
     * 
     * @param {number} weekNumber Week number
     * @param {boolean} skipLoading Skips setting loading in state
     * @param {any} fetchPolicy Fetch policy
     */
    private async _getEventData(weekNumber: number = this.state.weekNumber, skipLoading?: boolean, fetchPolicy: any = 'network-only') {
        this.setState({ loading: !skipLoading, weekNumber });
        const { data: { event_data, weeks } } = await graphql.query({
            query: GET_EVENT_DATA,
            variables: { weekNumber },
            fetchPolicy,
        });
        let data: IGetEventData = { ...event_data, weeks };
        let isConfirmed = data.confirmedDuration > 0
        this.setState({ data, loading: false, isConfirmed });
    }
}