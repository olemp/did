
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import * as React from 'react';

export const ActionBar = ({ onClick, disabled }) => {
    return (
        <CommandBar
            styles={{ root: { margin: '10px 0 10px 0', padding: 0 } }}
            items={[
                {
                    key: 'CONFIRM_WEEK',
                    name: 'Confirm week',
                    iconProps: { iconName: 'CheckMark' },
                    onClick: onClick.CONFIRM_WEEK,
                    disabled: disabled.CONFIRM_WEEK,
                },
                {
                    key: 'UNCONFIRM_WEEK',
                    name: 'Unconfirm week',
                    iconProps: { iconName: 'ErrorBadge' },
                    onClick: onClick.UNCONFIRM_WEEK,
                    disabled: disabled.UNCONFIRM_WEEK,
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