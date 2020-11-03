import { ICalloutProps } from 'office-ui-fabric-react/lib/Callout'
import { LabelObject } from 'types'

export interface ISelectCalloutProps extends ICalloutProps {
    labels: LabelObject[];
    searchLabelText: string;
    defaultSelectedKeys?: string[];
    onToggleLabel: (label: LabelObject) => void;
}
