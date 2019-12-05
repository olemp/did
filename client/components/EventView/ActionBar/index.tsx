
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import * as React from 'react';

export const ActionBar = ({ onClick, disabled }) => {
    return (
        <CommandBar
            styles={{ root: { margin: '10px 0 10px 0', padding: 0 } }}
            items={[
                {
                    key: 'CONFIRM_PERIOD',
                    name: 'Confirm period',
                    iconProps: { iconName: 'CheckMark' },
                    onClick: onClick.CONFIRM_PERIOD,
                    disabled: disabled.CONFIRM_PERIOD,
                },
                {
                    key: 'UNCONFIRM_PERIOD',
                    name: 'Unconfirm period',
                    iconProps: { iconName: 'ErrorBadge' },
                    onClick: onClick.UNCONFIRM_PERIOD,
                    disabled: disabled.UNCONFIRM_PERIOD,
                },
            ]}
            farItems={[
                {
                    key: 'RELOAD',
                    name: 'Reload',
                    iconProps: { iconName: 'Refresh' },
                    onClick: onClick.RELOAD,
                }
            ]}
        />
    )
}