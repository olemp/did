import { useQuery } from '@apollo/react-hooks';
import * as getValue from 'get-value';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import { ICalEvent } from 'models';
import * as excel from 'utils/exportExcel';
import { GET_CONFIRMED_TIME_ENTRIES } from './GET_CONFIRMED_TIME_ENTRIES';



export const Reports = () => {
    const { loading, error, data } = useQuery(GET_CONFIRMED_TIME_ENTRIES);

    const entries = getValue(data, 'result.entries', { default: [] }) as ICalEvent[];

    const onExport = async () => excel.exportExcel(
        entries, {
        skip: ['id', '__typename'],
        fileName: `ApprovedTimeEntries-${new Date().getTime()}.xlsx`,
        capitalize: true,
    });


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