import React from 'react'
import {getRandomStr} from "../../utils/stringHelpers";
import {Button} from "@material-ui/core";

let xlsx = require('json-as-xlsx')

interface IProps {
    dataToExport: any;
    fileName?: string;
}

export const ExportToExcel = ({dataToExport}: IProps) => {

    function downloadFilteredResult(data:any){
        let reportData = [
            {
                sheet: 'Transfer Report',
                columns: [
                    { label: 'ID', value: 'id' },
                    { label: 'Application Date', value: 'applicationDate' },
                    { label: 'Reference Number', value: 'referenceNumber' },
                    { label: 'Applicant Name', value: 'applicantName' },
                    { label: 'Beneficiary Name', value: 'beneficiaryName' },
                    { label: 'Beneficiary Bank Name', value: 'beneficiaryBankName' },
                    { label: 'Amount ', value: 'amount' },
                    { label: 'Currency', value: 'currency' },
                    { label: 'Status', value: 'status' },
                ],
                content: data
            }
        ];

        let settings = {
            fileName: 'transfer-report'.concat(`file-${getRandomStr(5)}`), // Name of the spreadsheet
            extraLength: 4, // A bigger number means that columns will be wider
            writeOptions: {} // Style options from https://github.com/SheetJS/sheetjs#writing-options
        }

        xlsx(reportData, settings) // Will download the excel file

    }

    return (
        <Button onClick={(e) => downloadFilteredResult(dataToExport) } variant="outlined" color="primary">Export</Button>
    );
};