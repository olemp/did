import * as React from 'react';
import { IChartsState } from './IChartsState';


export const SectionHeader = ({ text }) => (
    <span style={{ display: 'block', fontSize: 12, letterSpacing: 3, paddingBottom: 3, textTransform: 'uppercase', marginBottom: 10 }}>{text}</span>
);

export class Charts extends React.Component<{}, IChartsState> {
    public render() {
        return null;
    }
}