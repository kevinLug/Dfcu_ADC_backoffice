import React from 'react'
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";


import {getRandomStr} from "../../utils/stringHelpers";
import {Button} from "@material-ui/core";

let xlsx = require('json-as-xlsx')


interface IProps {
    dataToExport: any;
    fileName?: string;
}

export const ExportToExcel = ({dataToExport, fileName}: IProps) => {
    const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    const exportToCSV = (dataToExport: any, fileName: string) => {
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = {Sheets: {data: ws}, SheetNames: ["data"]};
        const excelBuffer = XLSX.write(wb, {bookType: "xlsx", type: "array"});
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    };

    function getFileName() {
        if (!fileName) {
            return `file-${getRandomStr(5)}`
        }
        return fileName
    }

    // based on https://www.npmjs.com/package/json-as-xlsx
    function useJsonAsExcel(row:any, dataCollection: []){
        let data = [
            {
                sheet: 'Transfer Report',
                columns: [
                    { label: 'ID', value: row.id }, // Top level data
                ],
                content: dataCollection
            }

        ];

        return data;
    }

    function downloadFilteredResult(data:any){
        let settings = {
            fileName: 'transfer-report'.concat(`file-${getRandomStr(5)}`), // Name of the spreadsheet
            extraLength: 3, // A bigger number means that columns will be wider
            writeOptions: {} // Style options from https://github.com/SheetJS/sheetjs#writing-options
        }
        xlsx(data, settings) // Will download the excel file
    }

    return (
        <Button onClick={(e) => exportToCSV(dataToExport, getFileName())} variant="outlined" color="primary">Export</Button>
    );
};