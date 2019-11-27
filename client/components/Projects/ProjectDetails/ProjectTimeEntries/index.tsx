import { IDetailsHeaderProps } from 'office-ui-fabric-react/lib/DetailsList';
import { ScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';
import { IRenderFunction } from 'office-ui-fabric-react/lib/Utilities';
import * as React from 'react';
import { EventList } from '../../../WeekView/EventList';

export const ProjectTimeEntries = ({ entries, enableShimmer }) => {
    const onRenderDetailsHeader = (props: IDetailsHeaderProps, render: IRenderFunction<IDetailsHeaderProps>) => {
        return (
            <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced={true}>
                {render(props)}
            </Sticky>
        );
    }
    return (
        <div style={{ position: 'relative', height: 300 }}>
            <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto} styles={{ contentContainer: { overflowX: 'hidden' } }}>
                <EventList
                    enableShimmer={enableShimmer}
                    events={entries}
                    onRenderDetailsHeader={onRenderDetailsHeader}
                    hideColumns={['project']}
                    dateFormat='MMM Do YYYY' />
            </ScrollablePane>
        </div>
    );
}