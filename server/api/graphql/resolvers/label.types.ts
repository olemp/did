export interface ILabel {
  name: string
  description: string
  color: string
  icon?: string
}

/**
 * Variables for query laabels
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ILabelsQueryVariables {}

/**
 * Variables for mutation addOrUpdateLabel
 */
export interface IAddOrUpdateLabelVariables {
  label: ILabel;
  update: boolean;
}

/**
 * Variables for mutation deleteLabel
 */
export interface IDeleteLabelVariables {
  name: string;
}
