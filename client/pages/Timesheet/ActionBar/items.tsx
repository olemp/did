import resource from 'i18n';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import * as React from 'react';
import { ITimesheetContext } from '../TimesheetContext';
import { ACTIONBAR_ICON_PROPS } from './ACTIONBAR_ICON_PROPS';
import { IActionBarProps } from './IActionBarProps';

export const MOVE_CURRENT_WEEK = ({ scope, dispatch }: ITimesheetContext): IContextualMenuItem => ({
    key: 'MOVE_CURRENT_WEEK',
    iconOnly: true,
    iconProps: { iconName: 'RenewalCurrent', ...ACTIONBAR_ICON_PROPS },
    onClick: () => dispatch({ type: 'MOVE_SCOPE', payload: new Date().toISOString() }),
    disabled: scope.isCurrentWeek,
    title: resource('TIMESHEET.COMMANDBAR_CURRENT_WEEK_TEXT'),
});

export const MOVE_PREV_WEEK = ({ dispatch }: ITimesheetContext): IContextualMenuItem => ({
    key: 'MOVE_PREV_WEEK',
    iconOnly: true,
    iconProps: { iconName: 'Back', ...ACTIONBAR_ICON_PROPS },
    onClick: () => dispatch({ type: 'MOVE_SCOPE', payload: { amount: -1, unit: 'week' } }),
    title: resource('TIMESHEET.COMMANDBAR_PREV_WEEK_TEXT')
});

export const MOVE_NEXT_WEEK = ({ dispatch }: ITimesheetContext): IContextualMenuItem => ({
    key: 'MOVE_NEXT_WEEK',
    iconOnly: true,
    iconProps: { iconName: 'Forward', ...ACTIONBAR_ICON_PROPS },
    onClick: () => dispatch({ type: 'MOVE_SCOPE', payload: { amount: 1, unit: 'week' } }),
    title: resource('TIMESHEET.COMMANDBAR_NEXT_WEEK_TEXT'),
});

export const CHANGE_PERIOD = ({ periods, loading, selectedPeriod, dispatch }: ITimesheetContext): IContextualMenuItem[] => {
    if (periods.length === 1) {
        return [
            {
                key: 'CHANGE_PERIOD_0',
                onRender: () => (
                    <span style={{ paddingTop: 12 }}>
                        {selectedPeriod.getName(false)}
                    </span>
                ),
            }
        ]
    }
    return periods.map((period, idx) => ({
        key: `CHANGE_PERIOD_${idx}`,
        onRender: () => (
            <DefaultButton
                hidden={!!loading}
                iconProps={{ iconName: 'DateTime' }}
                onClick={() => dispatch({ type: 'CHANGE_PERIOD', payload: period.id })}
                text={period.getName(true)}
                styles={{ root: { height: 44, marginLeft: 4 } }}
                checked={period.id === selectedPeriod.id} />
        ),
    }));
};

export const CONFIRM_ACTIONS = (
    { loading, selectedPeriod }: ITimesheetContext,
    { onConfirmPeriod, onUnconfirmPeriod }: IActionBarProps,
): IContextualMenuItem => ({
    key: 'CONFIRM_HOURS',
    onRender: () => selectedPeriod.isConfirmed
        ? <DefaultButton
            disabled={!!loading}
            iconProps={{ iconName: 'Cancel' }}
            onClick={onUnconfirmPeriod}
            text={resource('TIMESHEET.UNCONFIRM_HOURS_TEXT')}
            styles={{ root: { height: 44, marginLeft: 4 } }} />
        : <PrimaryButton
            disabled={!!loading || selectedPeriod.unmatchedDuration > 0 || selectedPeriod.events.length === 0}
            iconProps={{ iconName: 'CheckMark' }}
            onClick={onConfirmPeriod}
            text={resource('TIMESHEET.CONFIRM_HOURS_TEXT')}
            styles={{ root: { height: 44, marginLeft: 4 } }} />
});