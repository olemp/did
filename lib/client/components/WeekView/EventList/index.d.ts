/// <reference types="react" />
import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { IEventListProps } from './IEventListProps';
export declare const EventListColumns: IColumn[];
export declare const EventList: ({ hidden, events, enableShimmer, hideColumns }: IEventListProps) => JSX.Element;
