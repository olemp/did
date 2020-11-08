
export interface IChartConfig {
    key: string;
    title: string;
    colors: 'bright' | 'light' | 'dark' | 'random';
    idKey: string;
    valueKey: string;
    valuePostfix: string;
    textKey: string;
    subTextKey?: string;
}

export interface IChartItem<T> {
    id: string;
    label: string;
    data: T;
    value: number;
}