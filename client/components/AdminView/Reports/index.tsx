import { useQuery } from '@apollo/react-hooks';
import { IColumn, List } from 'components/List';
import { UserMessage } from 'components/UserMessage';
import { getValueTyped as value } from 'helpers';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import * as React from 'react';
import * as format from 'string-format';
import { humanize } from 'underscore.string';
import * as excelUtils from 'utils/exportExcel';
import { generateColumn } from 'utils/generateColumn';
import { GET_CONFIRMED_TIME_ENTRIES } from './GET_CONFIRMED_TIME_ENTRIES';

/**
 * @component Reports
 * @description Consists of a DetailsList with all confirmed time entries and an export to excel button
 */
export const Reports = ({ skip = ['id', '__typename'], fileName = 'ApprovedTimeEntries-{0}.xlsx' }) => {
    const { loading, error, data } = useQuery(GET_CONFIRMED_TIME_ENTRIES);

    const entries = value<any[]>(data, 'result.entries', []).map(entry => {
        entry.customer = entry.customer.name;
        return entry;
    });

    const columns: IColumn[] = Object.keys(entries[0] || {})
        .filter(f => skip.indexOf(f) === -1)
        .map(fieldName => generateColumn(fieldName, humanize(fieldName), { minWidth: 60, maxWidth: 100 }));

    const onExport = () => {
        excelUtils.exportExcel(
            entries,
            {
                skip,
                fileName: format(fileName, new Date().getTime()),
                capitalize: true,
            },
        );
    }

    return (
        <div>
            <CommandBar
                hidden={entries.length === 0}
                styles={{ root: { margin: '10px 0 10px 0', padding: 0 } }}
                items={[{
                    key: 'EXPORT_TO_EXCEL',
                    text: 'Export to Excel',
                    onClick: onExport,
                    iconProps: { iconName: 'ExcelDocument' },
                    disabled: loading || !!error,
                }]} />
            <List
                hidden={entries.length === 0}
                items={entries}
                columns={columns}
                enableShimmer={loading} />
            <UserMessage hidden={entries.length > 0 || loading} text={`There's no confirmed time entries at this time.`} />
        </div>
    );
}