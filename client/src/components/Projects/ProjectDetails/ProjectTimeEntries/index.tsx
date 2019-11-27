import { ScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';
import * as React from 'react';
import { EventList } from '../../../WeekView/EventList';

export const ProjectTimeEntries = ({ entries }) => (
    <div style={{ position: 'relative', height: 300 }}>
        <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto} styles={{ contentContainer: { overflowX: 'hidden' } }}>
            <EventList events={entries} hideColumns={['project']} />
        </ScrollablePane>
    </div>
);