import { stringToArrayBuffer } from 'helpers';
import { loadScripts } from './loadScripts';
import * as _ from 'underscore.string';

export interface IExcelExportOptions {
    fileName: string;
    columns?: string[];
    skip?: string[];
    capitalize?: boolean;
}

/**
 * Export to Excel
 * 
 * @param {string[]} columns An array of columns
 * @param {any[]} items An array of items
 * @param {IExcelExportOptions} options Options
 * 
 * @return Returns the generate blob
 */
export async function exportExcel(items: any[], options: IExcelExportOptions) {
    await loadScripts([
        'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.14.5/xlsx.full.min.js',
    ]);

    if (!options.columns) {
        options.columns = Object.keys(items[0]).filter(f => (options.skip || []).indexOf(f) === -1);
    }

    const sheets = [{
        name: 'Sheet 1',
        data: [
            options.columns.map(c => options.capitalize ? _.capitalize(c) : c),
            ...items.map(item => options.columns.map(fn => item[fn])),
        ],
    }];
    const workBook = ((window as any)).XLSX.utils.book_new();
    sheets.forEach(s => {
        const sheet = ((window as any)).XLSX.utils.aoa_to_sheet(s.data);
        ((window as any)).XLSX.utils.book_append_sheet(workBook, sheet, s.name);
    });
    const wbout = ((window as any)).XLSX.write(workBook, { type: 'binary', bookType: 'xlsx' });
    const blob = new Blob([stringToArrayBuffer(wbout)], { type: 'application/octet-stream' });
    (window as any).saveAs(blob, options.fileName);
    return blob;
}