import { useQuery } from '@apollo/react-hooks';
import { List } from 'components/List';
import { getValueTyped as value } from 'helpers';
import { ICalEvent } from 'models';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import * as React from 'react';
import * as format from 'string-format';
import { humanize } from 'underscore.string';
import * as excelUtils from 'utils/exportExcel';
import { generateColumn } from 'utils/generateColumn';
import { GET_CONFIRMED_TIME_ENTRIES } from './GET_CONFIRMED_TIME_ENTRIES';

/**
 * @component Reports
 * @description 
 * @todo
 */
export const Reports = ({ skip = ['id', '__typename'], fileName = 'ApprovedTimeEntries-{0}.xlsx' }) => {
    const { loading, error, data } = useQuery(GET_CONFIRMED_TIME_ENTRIES);

    const entries = value<ICalEvent[]>(data, 'result.entries', []);

    const columns = Object.keys(entries[0] || {})
        .filter(f => skip.indexOf(f) === -1)
        .map(fieldName => generateColumn(fieldName, humanize(fieldName), { minWidth: 60, maxWidth: 100 }));

    const onExport = () => {
        excelUtils.exportExcel(
            entries, {
            skip,
            fileName: format(fileName, new Date().getTime()),
            capitalize: true,
        });
    }


    return (
        <div>
            <CommandBar items={[{
                key: 'EXPORT_TO_EXCEL',
                text: 'Export to Excel',
                onClick: onExport,
                iconProps: { iconName: 'ExcelDocument' },
                disabled: loading || !!error,
            }]} />
            <List
                items={entries}
                columns={columns}
                enableShimmer={loading}
                height={500} />
        </div>
    );
}