import { useQuery } from '@apollo/react-hooks';
import { EventList } from 'components/EventView/EventList';
import { GET_CONFIRMED_TIME_ENTRIES } from 'components/Reports/GET_CONFIRMED_TIME_ENTRIES';
import { currencyDisplay, getValueTyped } from 'helpers';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import * as excel from 'utils/exportExcel';
import { IProjectDetailsProps } from './IProjectDetailsProps';


export const ProjectDetails = ({ project }: IProjectDetailsProps) => {
    const { loading, error, data } = useQuery(GET_CONFIRMED_TIME_ENTRIES, { variables: { projectKey: project.key } });

    /** Initializing constants dependent on data from useQuery  */
    const entries = getValueTyped<any[]>(data, 'result.entries', []);
    const duration = getValueTyped<number>(data, 'result.duration', 0);

    const onExport = async () => {
        let key = project.key.toString().replace(/\s+/g, '-').toUpperCase();
        await excel.exportExcel(
            entries,
            {
                fileName: `ApprovedTimeEntries-${key}-${new Date().getTime()}.xlsx`,
                skip: ['id', '__typename'],
                capitalize: true,
            });
    }

    return (
        <div className='c-projectdetails'>
            <div className="container">
                <div className="row">
                    <div className="col-sm">
                        <h3>{project.name}</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm">
                        <p>{project.description}</p>
                    </div>
                </div>
                <div className="row" style={{ margin: '15px 0 25px 0' }} hidden={!project.budget}>
                    <div className="col-sm"><strong>Budget: </strong>{currencyDisplay(project.budget)}</div>
                    <div className="col-sm"><strong>Hourly rate: </strong>{currencyDisplay(project.hourlyRate)}</div>
                    <div className="col-sm"><strong>Confirmed: </strong>{currencyDisplay((duration / 60) * project.hourlyRate)} ({duration / 60})</div>
                    <div className="col-sm"><strong>Remaining: </strong>{currencyDisplay(project.budget - ((duration / 60) * project.hourlyRate))}</div>
                </div>
                <div className="row">
                    <div className="col-sm">
                        <DefaultButton
                            hidden={!project.webLink}
                            text='Project workspace'
                            onClick={() => window.location.replace(project.webLink)}
                            iconProps={{ iconName: 'WorkforceManagement' }}
                            disabled={loading || !!error || !project.webLink} />
                        <DefaultButton
                            text='Export to Excel'
                            iconProps={{ iconName: 'ExcelDocument' }}
                            onClick={onExport}
                            disabled={loading || !!error || entries.length === 0}
                            style={{ marginLeft: 5 }} />
                    </div>
                </div>
            </div>
            {error && <MessageBar messageBarType={MessageBarType.error}>An error occured.</MessageBar>}
            {!error && (
                <EventList
                    enableShimmer={loading}
                    events={entries}
                    hideColumns={['project', 'customer']}
                    dateFormat='MMM Do YYYY' />
            )}
        </div>
    );
};