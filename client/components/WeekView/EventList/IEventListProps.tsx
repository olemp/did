import { IDetailsHeaderProps } from 'office-ui-fabric-react/lib/DetailsList';
import { IRenderFunction } from 'office-ui-fabric-react/lib/Utilities';
import { ICalEvent } from "../../../models";

export interface IEventListProps {
    events: ICalEvent[];
    hidden?: boolean;
    enableShimmer?: boolean;
    hideColumns?: string[];
    dateFormat?: string;
    onRenderDetailsHeader?:  (props: IDetailsHeaderProps, render: IRenderFunction<IDetailsHeaderProps>) => JSX.Element;
}
