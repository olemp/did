import { stringToArrayBuffer } from '../helpers';
import { loadScripts } from './loadScripts';

export async function exportExcel(data: any[], fileName: string) {
    await loadScripts([
        'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.14.5/xlsx.full.min.js',
    ]);
    const sheets = [{ name: 'Sheet 1', data }];
    const workBook = ((window as any)).XLSX.utils.book_new();
    sheets.forEach(s => {
        const sheet = ((window as any)).XLSX.utils.aoa_to_sheet(s.data);
        ((window as any)).XLSX.utils.book_append_sheet(workBook, sheet, s.name);
    });
    const wbout = ((window as any)).XLSX.write(workBook, { type: "binary", bookType: "xlsx" });
    const blob = new Blob([stringToArrayBuffer(wbout)], { type: 'application/octet-stream' });
    (window as any).saveAs(blob, fileName);
    return blob;
}