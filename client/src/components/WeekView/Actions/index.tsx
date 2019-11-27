
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';


const CONFIRM_WEEK = gql`
    mutation($entries:[TimeEntryInput!], $weekNumber: Int!) {
        confirmWeek(entries: $entries, weekNumber: $weekNumber)
    }
`;

const UNCONFIRM_WEEK = gql`
    mutation($weekNumber: Int!) { 
        unconfirmWeek(weekNumber: $weekNumber)
    }
`;

export const Actions = ({
    weekView,
    weekNumber,
    onConfirmWeekEnabled,
    onUnconfirmWeekEnabled,
    onSetConfirmedHours,
}) => {
    const [[confirmWeek], [unconfirmWeek]] = [useMutation(CONFIRM_WEEK), useMutation(UNCONFIRM_WEEK)];

    const onConfirmWeek = async () => {
        const entries = (weekView.events as any[])
            .filter(e => e.project)
            .map(e => ({ id: e.id, projectKey: e.project.key }));
        let { data } = await confirmWeek({ variables: { weekNumber, entries } });
        onSetConfirmedHours(data.confirmWeek);
    }

    const onUnconfirmWeek = async () => {
        await unconfirmWeek({ variables: { weekNumber } })
        onSetConfirmedHours(0);
    }

    return (
        <div style={{ marginTop: 10, marginBottom: 10 }}>
            <PrimaryButton
                text='Confirm week'
                iconProps={{ iconName: 'CheckMark' }}
                onClick={onConfirmWeek}
                disabled={!onConfirmWeekEnabled} />
            <DefaultButton
                style={{ marginLeft: 8 }}
                text='Unconfirm week'
                iconProps={{ iconName: 'ErrorBadge' }}
                onClick={onUnconfirmWeek}
                disabled={!onUnconfirmWeekEnabled} />
        </div>
    );
}