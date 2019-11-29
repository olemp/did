import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';

/**
 * Generate a IColumn defintion
 * 
 * @param fieldName Field name
 * @param name Name
 * @param props Additional props
 * @param onRender On render function (optional)
 * @param minWidth Min width (defaults to 100)
 */
export function generateColumn(fieldName: string, name: string, props: Partial<IColumn> = {}, onRender?: any, minWidth = 100): IColumn {
    return {
        key: fieldName,
        fieldName,
        name,
        minWidth,
        onRender,
        isResizable: true,
        ...props,
    };
}