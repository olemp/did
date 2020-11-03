import { ICalloutProps } from 'office-ui-fabric-react/lib/Callout'
import { ILabel } from 'types'

export interface ISelectCalloutProps extends ICalloutProps {
    labels: ILabel[];
    searchLabelText: string;
    defaultSelectedKeys?: string[];
    onToggleLabel: (label: ILabel) => void;
}
