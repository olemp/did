import { ScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';
import * as React from 'react';
import { EventList } from 'components/WeekView/EventList';

export const ProjectTimeEntries = ({ entries, enableShimmer }) => {
    return (
        <div style={{ position: 'relative', height: 300 }}>
            <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto} styles={{ contentContainer: { overflowX: 'hidden' } }}>
                <EventList
                    enableShimmer={enableShimmer}
                    events={entries}
                    hideColumns={['project']}
                    dateFormat='MMM Do YYYY' />
            </ScrollablePane>
        </div>
    );
}