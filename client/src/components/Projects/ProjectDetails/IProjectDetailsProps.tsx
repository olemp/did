import { IProject, ICalEvent } from "../../../models";

export interface IProjectDetailsProps {
    project: IProject;
    entries: ICalEvent[];
}
