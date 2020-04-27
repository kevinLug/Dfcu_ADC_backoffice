export interface IExcelColumn {
    dataKey: string,
    title: string
}

const template = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40" lang="en">
         <head>
          <!--[if gte mso 9]>
           <xml>
            <x:ExcelWorkbook>
             <x:ExcelWorksheets>
              <x:ExcelWorksheet>
               <x:Name>{worksheet}</x:Name>
               <x:WorksheetOptions>
                <x:DisplayGridlines/>
               </x:WorksheetOptions>
              </x:ExcelWorksheet>
             </x:ExcelWorksheets>
            </x:ExcelWorkbook>
           </xml>
          <![endif]-->
          <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
         </head>
         <body>
          <table>{table}</table>
         </body>
        </html>
        `


const createTable = (tableData: any[], columns: IExcelColumn[]) => {
    const table = document.createElement('table');
    // Create header
    const tHead = document.createElement('thead');
    const headRow = document.createElement('tr');
    columns.forEach(col => {
        const cell = document.createElement('th');
        cell.appendChild(document.createTextNode(col.title));
        headRow.appendChild(cell);
    })
    tHead.appendChild(headRow);
    table.appendChild(tHead);

    // Create body
    const tableBody = document.createElement('tbody');
    tableData.forEach(rowData => {
        const row = document.createElement('tr');
        columns.forEach(col => {
            const cellData = rowData[col.dataKey] || ''
            const cell = document.createElement('td');
            cell.appendChild(document.createTextNode(cellData));
            row.appendChild(cell);
        })
        tableBody.appendChild(row);
    });
    table.appendChild(tableBody);
    return table;
}


export const excelExport = (tableData: any[], columns: IExcelColumn[], name: string = 'excel_data') => {

    try {

       const filename = name+'.xls';
        const table = createTable(tableData, columns)
        const uri = 'data:application/vnd.ms-excel;base64,';
        const base64 = (s: any) => {
            return window.btoa(unescape(encodeURIComponent(s)))
        }
        const format = (s: any, c: any) => {
            return s.replace(/{(\w+)}/g, function (m: any, p: any) {
                return c[p];
            })
        }
        const ctx = {
            worksheet: filename,
            table: table.innerHTML
        }
        const downloadLink = document.createElement("a");
        document.body.appendChild(downloadLink);
        downloadLink.href =  uri + base64(format(template, ctx))
        downloadLink.download = filename;
        downloadLink.click();
    }catch (e) {
        console.error(e)
    }

}
