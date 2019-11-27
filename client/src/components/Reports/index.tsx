import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import { loadScripts } from '../../utils/loadScripts';
import { exportExcel } from '../../utils/exportExcel';

const fields = [
    'title',
    'description',
    'customerKey',
    'projectKey',
    'durationHours',
    'startTime',
    'endTime',
    'weekNumber',
    'yearNumber',
    'webLink',
    'durationHours',
    'resourceName',
    'resourceEmail',
];

export const GET_CONFIRMED_ENTRIES = gql`
    query($projectKey: String) {
        confirmedEntries(projectKey: $projectKey) {
           ${fields.join(',')}
        }
    }
`;

export const Reports = () => {
    const { loading, error, data } = useQuery(GET_CONFIRMED_ENTRIES);

    const onExport = async () => {
        await loadScripts([
            'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.14.5/xlsx.full.min.js',
        ]);
        await exportExcel(
            [fields, ...data.confirmedEntries.map(item => fields.map(fieldName => item[fieldName]))],
            `ApprovedTimeEntries-${new Date().getTime()}.xlsx`,
        );
    }

    return (
        <div>
            <DefaultButton
                text='Export to Excel'
                iconProps={{ iconName: 'ExcelDocument' }}
                onClick={onExport}
                disabled={loading || !!error} />
        </div>
    );
}