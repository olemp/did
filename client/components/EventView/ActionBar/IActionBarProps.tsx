import { TypedHash } from '@pnp/common';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';

export interface IActionBarProps {
    onClick: TypedHash<any>;
    disabled: TypedHash<boolean>;
    weekNumber: number;
    groupBy?: IContextualMenuItem;
    onChangeWeek: (weekNumber: number) => void;
    onGroupByChanged: (groupBy: IContextualMenuItem) => void;
}
