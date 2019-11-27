import { useQuery } from '@apollo/react-hooks';
import * as getValue from 'get-value';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import { exportExcel } from '../../../utils/exportExcel';
import { GET_CONFIRMED_ENTRIES, IGetConfirmedEntries } from '../../Reports/GET_CONFIRMED_ENTRIES';
import { IProjectDetailsProps } from './IProjectDetailsProps';
import { ProjectTimeEntries } from './ProjectTimeEntries';

export const ProjectDetails = ({ project }: IProjectDetailsProps) => {
    if (!project) return null;

    const { loading, error, data } = useQuery<IGetConfirmedEntries>(GET_CONFIRMED_ENTRIES, { variables: { projectKey: project.key } });

    const onExport = async () => {
        let fields = ['id', 'title', 'webLink', 'durationMinutes', 'startTime', 'endTime'];
        let key = project.key.toString().replace(/\s+/g, '-').toUpperCase();
        await exportExcel(
            [fields, ...data.confirmedEntries.map(item => fields.map(fieldName => item[fieldName]))],
            `ApprovedTimeEntries-${key}-${new Date().getTime()}.xlsx`,
        );
    }

    const entries = getValue(data, 'confirmedEntries', { default: [] });

    return (
        <div style={{ marginTop: 30 }}>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <div>
                <DefaultButton
                    hidden={!project.webLink}
                    text='Project workspace'
                    href={project.webLink}
                    iconProps={{ iconName: 'WorkforceManagement' }}
                    disabled={loading || !!error || !project.webLink} />
                <DefaultButton
                    text='Export to Excel'
                    iconProps={{ iconName: 'ExcelDocument' }}
                    onClick={onExport}
                    disabled={loading || !!error || entries.length === 0}
                    style={{ marginLeft: 5 }} />
            </div>
            {error && <MessageBar messageBarType={MessageBarType.error}>An error occured.</MessageBar>}
            {!error && <ProjectTimeEntries enableShimmer={loading} entries={entries} />}
        </div>
    );
};