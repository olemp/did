import { ILabel } from 'types'
import { IPanelProps } from 'office-ui-fabric-react/lib/Panel'

export interface ILabelFormProps extends IPanelProps {
    title?: string;
    label?: ILabel;
    onSave?: (label: ILabel) => void;
}
