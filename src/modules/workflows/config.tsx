import {XHeadCell} from "../../components/table/XTableHead";
import ApplicationLink from "../../components/links/ApplicationLink";
import {printDateTime} from "../../utils/dateHelpers";
import React from "react";
import {renderStatus} from "./widgets";
import {toTitleCase} from "../contacts/types";
import {IWorkflow, WorkflowStatus} from "./types";

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
        name: 'applicationDate', label: 'Application Date', render: printDateTime,
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
        render: (data, rec) => data
    },

    {
        name: 'type', label: 'Type',
        render: (value: string, rec: any) => `${toTitleCase(value)}`,
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
        render: (data) => {
            if (data === WorkflowStatus.Open) {
                return renderStatus(WorkflowStatus.New)
            }
            if (data === WorkflowStatus.Error) {
                return renderStatus(WorkflowStatus.Rejected)
            }
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

export const workflowTypes = ['FOREIGNREMITTANCE', 'EFT', 'RTGS', 'RTGSLOCAL', 'EAPS', 'REPSS', 'Foreign Draft']

export enum RequestType {

    FOREIGN_REMITTANCE = 'FOREIGNREMITTANCE',
    EFT = 'EFT',
    RTGS_LOCAL = 'RTGSLOCAL',
    RTGS = 'RTGS',
    EAPS = 'EAPS',
    REPSS = 'REPSS',
    ForeignDraft = 'foreignDraft',

}

export const parseWorkflows = (data: IWorkflow[]) => {
    return data.map(it => {
        return {}
    })
}
