
import * as moment from 'moment';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as React from 'react';
import { getHash } from 'utils/getHash';
import log from 'utils/log';
import { client as graphql } from '../../graphql';
import { ConfirmWeekButton } from './ConfirmWeekButton';
import CONFIRM_WEEK from './CONFIRM_WEEK';
import { EventList } from './EventList';
import GET_EVENT_DATA, { IGetEventData } from './GET_EVENT_DATA';
import { IEventViewProps } from './IEventViewProps';
import { IEventViewState } from './IEventViewState';
import { StatusBar } from './StatusBar';
import { UnconfirmWeekButton } from './UnconfirmWeekButton';
import UNCONFIRM_WEEK from './UNCONFIRM_WEEK';
require('moment/locale/en-gb');

export class EventView extends React.Component<IEventViewProps, IEventViewState> {
    constructor(props: IEventViewProps) {
        super(props);
        this.state = { weekNumber: getHash({ parseInt: true }) || moment().week(), data: { events: [] } };
    }

    public componentDidMount() {
        this._getEventData(this.state.weekNumber);
    }

    public render() {
        const { loading, weekNumber, isConfirmed, data } = this.state;

        return (
            <div className='c-eventview'>
                <div className='c-eventview-actions'>
                    <ConfirmWeekButton onClick={this._onConfirmWeek.bind(this)} disabled={loading || isConfirmed} />
                    <UnconfirmWeekButton onClick={this._onUnconfirmWeek.bind(this)} disabled={loading || !isConfirmed} />
                </div>
                <Pivot
                    className='c-eventview-section-container'
                    styles={{ root: { display: 'flex', flexWrap: 'wrap' } }}
                    defaultSelectedKey={weekNumber.toString()}
                    onLinkClick={this._onChangeWeek.bind(this)}>
                    {this._getWeeksToRender().map(({ key, itemKey, headerText, renderContent }) => (
                        <PivotItem
                            key={key}
                            itemKey={itemKey}
                            headerText={headerText}>
                            {renderContent && (
                                <div className='c-eventview-section-content'>
                                    {!loading && <StatusBar isConfirmed={isConfirmed} data={data} />}
                                    <EventList enableShimmer={loading || isConfirmed} events={data.events} />
                                </div>
                            )}
                        </PivotItem>
                    ))}
                </Pivot>
            </div>
        )
    }

    /**
     * Get weeks to render in the pivot
     */
    private _getWeeksToRender() {
        return Array.from(Array(10).keys())
            .map(i => moment().week() - (10 - 1) + i)
            .map(wn => ({
                key: wn.toString(),
                itemKey: wn.toString(),
                headerText: `Week ${wn}`,
                renderContent: wn === this.state.weekNumber,
            }));
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
        log.info('_onConfirmWeek', result.error)
        this.setState({ loading: false, isConfirmed: result.success });
    };

    /**
     * On unconfirm week
     */
    private async _onUnconfirmWeek() {
        this.setState({ loading: true });
        let { data: { result } } = await graphql.mutate({ mutation: UNCONFIRM_WEEK, variables: { weekNumber: this.state.weekNumber } });
        log.info('_onUnconfirmWeek', result.error)
        this.setState({ loading: false, isConfirmed: !result.success });

    };

    /**
     * Get event data for week number
     * 
     * @param {number} weekNumber Week number
     */
    private async _getEventData(weekNumber: number) {
        this.setState({ loading: true, weekNumber });
        const { data: { event_data } } = await graphql.query({
            query: GET_EVENT_DATA,
            variables: { weekNumber },
            fetchPolicy: 'network-only',
        });
        let data: IGetEventData = event_data;
        let isConfirmed = data.confirmedDuration > 0
        this.setState({ data, loading: false, isConfirmed });
    }
}