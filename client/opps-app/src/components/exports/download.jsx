
import { formatDate } from './formatLocale';

var cloneDeep = require('lodash/cloneDeep');

//////////
// download menu
//

// returns downloadItems to OppsTable
export function createDownloadItems(dt, opportunities, expandedRowData) {
    
    // format dates in it-IT locale
    let modifiedOpps = cloneDeep(opportunities);

    modifiedOpps.forEach((opp) => {
        const d1 = new Date(opp.date);
        opp.date = formatDate(d1);
    });

    const downloadItems = [
        {
            label: 'Download',
            items: [
                {
                    label: 'Excel...',
                    icon: 'pi pi-file-excel',
                    command: () => {
                        exportExcel(modifiedOpps, expandedRowData);
                    }
                },
                {
                    label: 'PDF...',
                    icon: 'pi pi-file-pdf',
                    command: () => {
                        exportPdf(modifiedOpps);
                    }
                },
                {
                    label: 'CSV...',
                    icon: 'pi pi-file-export',
                    command: () => {
                        exportCSV(false, dt);
                    }
                }
            ]
        }

    ]; // downloadItems

    return downloadItems;

} // createDownloadItems()


// returns downloadItems to ClientDatabaseBody
export function createClientDatabaseDownloadItems(dt, clients, columns, database) {

    const downloadClientDatabaseColumns = columns.map(column => (
        { title: column, dataKey: column }
    ))

    const exportPdf = (clients, downloadColumns) => {
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable({
                    columns: downloadColumns,
                    body: clients,
                    margin: { top: 35 }
                })
                doc.save(`${database}.pdf`);
            })
        })
    } // exportPDF()

    const exportExcel = (clients) => {
        import('xlsx').then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(clients);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAsExcelFile(excelBuffer, `${database}`);
        });

    } // exportExcel()

    const exportCSV = (selectionOnly, dt) => {
        dt.current.exportCSV({ selectionOnly });
    } // exportCSV()


    const downloadItems = [
        {
            label: 'Download',
            items: [
                {
                    label: 'Excel...',
                    icon: 'pi pi-file-excel',
                    command: () => {
                        exportExcel(clients);
                    }
                },
                {
                    label: 'PDF...',
                    icon: 'pi pi-file-pdf',
                    command: () => {
                        exportPdf(clients, downloadClientDatabaseColumns);
                    }
                },
                {
                    label: 'CSV...',
                    icon: 'pi pi-file-export',
                    command: () => {
                        exportCSV(false, dt);
                    }
                }
            ]
        }

    ]; // downloadItems

    return downloadItems;

} // createClientDatabaseDownloadItems()

// columns for OppsTable
const downloadColumns = [
    { title: 'Id', dataKey: 'id' },
    { title: 'Name', dataKey: 'name' },
    { title: 'Company', dataKey: 'company' },
    { title: 'Starting Date', dataKey: 'date' },
    { title: 'Value (K)', dataKey: 'value' },
    { title: 'Status', dataKey: 'status' }
]

// for OppsTable
const exportCSV = (selectionOnly, dt) => {
    dt.current.exportCSV({ selectionOnly });
} // exportCSV()

// for OppsTable
const exportPdf = (modifiedOpps) => {
    import('jspdf').then(jsPDF => {
        import('jspdf-autotable').then(() => {
            const doc = new jsPDF.default(0, 0);
            doc.autoTable({
                columns: downloadColumns,
                body: modifiedOpps,
                margin: { top: 35 }
            })
            doc.save('opportunites.pdf');
        })
    })
} // exportPDF()


// for OppsTable
const exportExcel = (modifiedOpps, expandedRowData) => {
    import('xlsx').then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(modifiedOpps);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        console.log("expandedRowData" + JSON.stringify(expandedRowData));
        if (expandedRowData.length > 0) {
            const expandedWorksheet = xlsx.utils.json_to_sheet(expandedRowData);
            xlsx.utils.book_append_sheet(workbook, expandedWorksheet, 'Expanded Data');
        }

        const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAsExcelFile(excelBuffer, 'opportunities');
    });

} // exportExcel()


// common
const saveAsExcelFile = (buffer, fileName) => {
    import('file-saver').then(module => {
        if (module && module.default) {
            let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            let EXCEL_EXTENSION = '.xlsx';
            const data = new Blob([buffer], {
                type: EXCEL_TYPE
            });

            module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
        }
    });
    
} // saveAsExcelFile()
