import {XHeadCell} from "../../components/table/XTableHead";
import ApplicationLink from "../../components/links/ApplicationLink";
import {printDateTime} from "../../utils/dateHelpers";
import React from "react";
import {renderStatus} from "./widgets";
import {toTitleCase} from "../contacts/types";
import {IWorkflow, WorkflowStatus, WorkflowSubStatus} from "./types";
import {ConstantLabelsAndValues} from "../../data/constants";


export enum RequestType {

    FOREIGN_REMITTANCE = 'FOREIGNREMITTANCE',
    EFT = 'EFT',
    RTGS_1 = 'RTGS1',
    RTGS = 'RTGS',
    EAPS = 'EAPS',
    REPSS = 'REPSS',
    ForeignDraft = 'foreignDraft',
    SWIFT = 'SWIFT',
    INTERNAL = 'INTERNAL'

}

export const wfInitialSort = 'applicationDate';
export const workflowHeadCells: XHeadCell[] = [
    {
        name: 'referenceNumber', label: 'Ref.No',
        render: (value, rec) => {
            return <ApplicationLink id={rec.id} name={rec.referenceNumber}/>
        },
        cellProps: {
            style: {
                width: 80,
                whiteSpace: 'nowrap'
            }
        },
    },
    {
        name: 'runDate', label: 'Application Date', render:(data,rec) =>{

            return printDateTime(data)
            // console.log('checking runDate:',rec)
            // // awaiting CSO submission
            // if (rec.subStatus === WorkflowSubStatus.AwaitingCSOApproval) {
            //     return printDateTime(data)
            // }
            //
            // // todo...consider rejection timestamp
            //
            // // failed CSO submission
            // if (rec.subStatus === WorkflowSubStatus.FailedCSOApproval){
            //     return printDateTime(rec.metaData.csoSubmissionDateTime)
            // }
            //
            // // awaiting BOM approval
            // if (rec.subStatus === WorkflowSubStatus.AwaitingBMApproval){
            //     return printDateTime(rec.metaData.csoSubmissionDateTime)
            // }
            //
            // // failed BOM approval
            // if (rec.subStatus === WorkflowSubStatus.FailedBMApproval) {
            //     return printDateTime(rec.metaData.bmoApprovalDateTime)
            // }
            //
            // // awaiting CMO clearance
            // if (rec.subStatus === WorkflowSubStatus.AwaitingSubmissionToFinacle) {
            //     return printDateTime(rec.metaData.cmoClearanceDateTime)
            // }
            //
            // // failed CMO submission
            // if (rec.subStatus === WorkflowSubStatus.FailedClearingDeptApproval){
            //     return printDateTime(rec.metaData.cmoClearanceDateTime)
            // }


        } ,
        cellProps: {
            style: {
                width: 80,
                whiteSpace: 'nowrap'
            }
        }
    },
    {
        name: 'metaData.applicantName',
        label: 'Applicant',
        cellProps: {
            style: {
                width: 80,
                whiteSpace: 'nowrap'
            }
        },
        render: (data, rec) => {
            console.log('record back:', rec)
            // if (hasValue(rec.caseData))
            //     console.log(`the case data: `, rec.caseData)
            // return <ContactLink
            //     id={rec.caseData}
            //     name={trimString(data, 20)}
            // />
            // return <XLink
            //     name={trimString(data, 20)}
            //     title={data}
            // />
            return data
        }
    },

    {
        name: 'metaData.beneficiaryName',
        label: 'Beneficiary',
        cellProps: {
            style: {
                width: 80,
                whiteSpace: 'nowrap'
            }
        },
        render: (data, rec) => data
    },

    {
        name: 'metaData.beneficiaryBankName',
        label: 'Beneficiary Bank',
        cellProps: {
            style: {
                width: 80,
                whiteSpace: 'nowrap'
            }
        },
        render: (data, rec) => {
            console.log('ttttt-data:', data)
            console.log('ttttt-rec:', rec)
            // let valueToDisplay = ''

            // if (rec.workflowType === RequestType.EFT || rec.workflowType === RequestType.RTGS_1)
            //     // @ts-ignore
            //     valueToDisplay = ConstantLabelsAndValues.mapOfRecipientBankCodeToValueOfBank().get(rec.beneficiaryBank.bankName).name
            // else
            //     valueToDisplay = data

            // @ts-ignore
            return rec.type === RequestType.EFT || rec.type === RequestType.RTGS_1 ? ConstantLabelsAndValues.mapOfRecipientBankCodeToValueOfBank().get(data).name : data
        }
    },

    {
        name: 'type', label: 'Type',
        render: (value: string, rec: any) => `${toTitleCase(value).toUpperCase()}`,
        cellProps: {
            style: {
                width: 80,
                whiteSpace: 'nowrap'
            }
        },
    },

    {
        name: 'metaData.currency',
        label: 'Currency',
        cellProps: {
            style: {
                width: 80,
                whiteSpace: 'nowrap'
            }
        },
        render: (data, rec) => data
    },


    {
        name: 'metaData.amount', label: 'Amount',
        cellProps: {
            style: {
                width: 80,
                whiteSpace: 'nowrap'
            }
        },
        render: (value: string, rec: any) => {
            return `${value}  ${rec.metaData.currency}`
        },

    },

    {
        name: 'status', label: 'Status',
        cellProps: {
            style: {
                width: 80,
                whiteSpace: 'nowrap'
            }
        },
        render: (data, rec) => {
            // awaiting submission
            if (data === WorkflowStatus.Open && rec.subStatus === WorkflowSubStatus.AwaitingCSOApproval) {
                return renderStatus(WorkflowStatus.New)
            }
            // awaiting BOM approval
            if (data === WorkflowStatus.Open && rec.subStatus === WorkflowSubStatus.AwaitingBMApproval) {
                return renderStatus(WorkflowStatus.Pending)
            }
            // awaiting CMO clearance
            if (data === WorkflowStatus.Open && rec.subStatus === WorkflowSubStatus.AwaitingSubmissionToFinacle) {
                return renderStatus(WorkflowStatus.PendingClearance)
            }
            // erred
            if (data === WorkflowStatus.Error) {
                return renderStatus(WorkflowStatus.Rejected)
            }
            // closed (sent to finacle)
            if (data === WorkflowStatus.Closed) {
                return renderStatus(WorkflowStatus.Cleared)
            }

            return renderStatus(data)
        },

    },
    // {
    //     name: 'subStatus', label: 'SubStatus', render: renderSubStatus,
    //     cellProps: {
    //         style: {
    //             width: 80,
    //             whiteSpace: 'nowrap'
    //         }
    //     }
    // },

    // {
    //     name: 'metaData.assigneeName',
    //     label: 'Assignee',
    //     render: (data, rec) => data ? <UserLink id={rec.assigneeId} name={getInitials(data)} title={data} /> : ''
    // },
];

export const workflowHeadCellsNew: XHeadCell[] = [...workflowHeadCells.filter(it => it.name !== 'metaData.assigneeName')]

export const workflowTypes = ['EFT',  'RTGS1', 'SWIFT', 'INTERNAL']


export const parseWorkflows = (data: IWorkflow[]) => {
    return data.map(it => {
        return {}
    })
}
