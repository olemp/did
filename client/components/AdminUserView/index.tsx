
import { useQuery } from '@apollo/react-hooks';
import { TypedHash } from '@pnp/common';
import * as getValue from 'get-value';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import * as React from 'react';
import { AllocationColumnChart } from './AllocationColumnChart';
import GET_USER_DATA, { ITimeEntry } from './GET_USER_DATA';
import { IAdminUserViewProps } from './IAdminUserViewProps';

export const GetAllocation = (entries: ITimeEntry[], key: string) => {
    return entries.reduce((obj: TypedHash<number>, entry: any) => {
        obj[entry[key]] = obj[entry[key]] || 0;
        obj[entry[key]] += entry.durationHours;
        return obj;
    }, {});
}

/**
 * @component AdminUserView
 * @description @todo
 */
export const AdminUserView = (variables: IAdminUserViewProps) => {
    const { data } = useQuery(GET_USER_DATA, { variables });

    let entries: ITimeEntry[] = getValue(data, 'result.entries', { default: [] });
    let allocation_project = GetAllocation(entries, 'projectKey');
    let allocation_customer = GetAllocation(entries, 'customerKey');

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm">
                    <HighchartsReact highcharts={Highcharts} options={AllocationColumnChart('Allocation per project 2019', allocation_project)} />
                </div>
            </div>
            <div className="row">
                <div className="col-sm">
                    <HighchartsReact highcharts={Highcharts} options={AllocationColumnChart('Allocation per customer 2019', allocation_customer)} />
                </div>
            </div>
        </div>
    );
}