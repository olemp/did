import * as React from 'react';
import { IChartsState } from './IChartsState';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import * as DummyConfig from './DummyConfig';


export const SectionHeader = ({ text }) => (
    <span style={{ display: 'block', fontSize: 12, letterSpacing: 3, paddingBottom: 3, textTransform: 'uppercase', marginBottom: 10 }}>{text}</span>
);

export class Charts extends React.Component<{}, IChartsState> {
    public render() {
        return (
            <div className="row" style={{ marginTop: 35 }}>
                <div className="col-sm">
                    <SectionHeader text='Client Totals' />
                    <ul style={{ listStyleType: 'none', margin: '20px 0 0 0', padding: 0 }}>
                        <li><span style={{ width: 180, display: 'inline-block' }}>Orkla</span> <b>38h</b></li>
                        <li><span style={{ width: 180, display: 'inline-block' }}>Bærum kommune</span> <b>8h</b></li>
                        <li><span style={{ width: 180, display: 'inline-block' }}>Internal</span> <b>5h</b></li>
                    </ul>
                </div>
                <div className="col-sm">
                    <SectionHeader text='Project Allocation' />
                    <HighchartsReact highcharts={Highcharts} options={DummyConfig.ProjectAllocation} />
                </div>
                <div className="col-sm">
                    <SectionHeader text='Appointment Status' />
                    <HighchartsReact highcharts={Highcharts} options={DummyConfig.AppointmentStatus} />
                </div>
            </div>
        );
    }
}