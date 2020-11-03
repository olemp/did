import { Customer, IProject } from 'types'


export interface ILabelColumnProps {
    label: string;
    project?: IProject;
    customer?: Customer;
}
