import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import { exportExcel } from '../../utils/exportExcel';
import graphql from '../../data/graphql';
import { loadScripts } from '../../utils/loadScripts';
import { IReportsProps, ReportsDefaultProps } from './IReportsProps';
import { IReportsState } from './IReportsState';

export class Reports extends React.Component<IReportsProps, IReportsState> {
    public static defaultProps = ReportsDefaultProps;

    constructor(props: IReportsProps) {
        super(props);
        this.state = { isLoading: true };
    }

    public async componentDidMount() {
        const entries = await this._getEntries();
        this.setState({ entries, isLoading: false });
    }

    public render() {
        return (
            <div>
                <DefaultButton
                    text='Export to Excel'
                    iconProps={{ iconName: 'ExcelDocument' }}
                    onClick={this._onExport.bind(this)}
                    disabled={this.state.isLoading} />
            </div>
        );
    }

    /**
     * When the export button is clicked
     */
    private async _onExport() {
        await loadScripts([
            'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.14.5/xlsx.full.min.js',
        ]);
        const data = [this.props.defaultFields, ...this.state.entries.map(item => this.props.defaultFields.map(fieldName => item[fieldName]))];
        const file = await exportExcel(data, `ApprovedTimeEntries-${new Date().getTime()}.xlsx`);
        console.log(file);
    }


    /**
     * Get entries from GraphQL endpont
     */
    private async _getEntries() {
        const { confirmedEntries: entries } = await graphql.query<{ confirmedEntries: any[] }>(`{confirmedEntries{${this.props.defaultFields.join(',')}}}`);
        return entries;
    }
}