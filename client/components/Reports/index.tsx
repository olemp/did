import { useQuery } from '@apollo/react-hooks';
import * as getValue from 'get-value';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import { ICalEvent } from 'models';
import { exportExcel } from 'utils/exportExcel';
import { GET_CONFIRMED_TIME_ENTRIES, GET_CONFIRMED_TIME_ENTRIES_FIELDS, IGetConfirmedTimeEntries } from './GET_CONFIRMED_TIME_ENTRIES';



export const Reports = () => {
    const { loading, error, data } = useQuery<IGetConfirmedTimeEntries>(GET_CONFIRMED_TIME_ENTRIES);

    const entries = getValue(data, 'entries', { default: [] }) as ICalEvent[];

    const onExport = async () => {
        await exportExcel(
            [GET_CONFIRMED_TIME_ENTRIES_FIELDS, ...entries.map(item => GET_CONFIRMED_TIME_ENTRIES_FIELDS.map(fieldName => item[fieldName]))],
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