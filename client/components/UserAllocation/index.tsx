
import { useQuery } from '@apollo/react-hooks';
import { TypedHash } from '@pnp/common';
import { getValueTyped as value } from 'helpers';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import * as React from 'react';
import { AllocationColumnChart } from './AllocationColumnChart';
import GET_USER_DATA, { ITimeEntry } from './GET_USER_DATA';
import { IUserAllocationProps } from './IUserAllocationProps';

/**
 * Get allocation
 * 
 * @param {ITimeEntry[]} entries Entries
 * @param {string} key Key
 */
export const GetAllocation = (entries: ITimeEntry[], key: string) => entries.reduce((obj: TypedHash<number>, entry) => {
    obj[entry[key]] = obj[entry[key]] || 0;
    obj[entry[key]] += entry.durationHours;
    return obj;
}, {});

/**
 * @component UserAllocation
 * @description 
 * @todo
 */
export const UserAllocation = (props: IUserAllocationProps) => {
    const { data, loading } = useQuery(GET_USER_DATA, { variables: props, fetchPolicy: 'cache-and-network' });
    if (loading) return null;
    let entries = value<ITimeEntry[]>(data, 'result.entries', []);
    return (
        <div className="container">
            {Object.keys(props.charts).map(key => (
                <div className="row" key={key}>
                    <div className="col-sm">
                        <HighchartsReact highcharts={Highcharts} options={AllocationColumnChart(props.charts[key], GetAllocation(entries, key))} />
                    </div>
                </div>
            ))}
        </div >
    );
}