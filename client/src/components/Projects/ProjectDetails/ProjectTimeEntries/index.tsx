import { ConstrainMode, DetailsList, DetailsListLayoutMode, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import { ScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';
import * as React from 'react';
import { Columns } from '../../../WeekView/EventList';
import { IProjectTimeEntriesProps } from './IProjectTimeEntriesProps';

export const ProjectTimeEntries = ({ entries }: IProjectTimeEntriesProps) => (
    <div style={{ position: 'relative', height: 300 }}>
        <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto} styles={{ contentContainer: { overflowX: 'hidden' } }}>
            <DetailsList
                columns={Columns}
                items={entries}
                selectionMode={SelectionMode.single}
                constrainMode={ConstrainMode.horizontalConstrained}
                layoutMode={DetailsListLayoutMode.justified} />
        </ScrollablePane>
    </div>
);