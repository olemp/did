import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

export interface IUserMessageProps {
    text?: string;
    onClick?: (event: React.MouseEvent<any>) => void;
    type?: MessageBarType;
    iconName?: string;
    hidden?: boolean;
    style?: React.CSSProperties;
    children?: any;
}
