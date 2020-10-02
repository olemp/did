import { NotificationModel } from '../types'
import { IPanelProps } from 'office-ui-fabric-react/lib/Panel'

export interface INotificationsPanelProps extends IPanelProps {
    notifications: Set<NotificationModel>;
    onDismissNotification: (notification: NotificationModel) => void;
}