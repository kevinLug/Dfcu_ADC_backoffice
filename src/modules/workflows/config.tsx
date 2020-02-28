import {XHeadCell} from "../../components/table/XTableHead";
import ApplicationLink from "../../components/links/ApplicationLink";
import {printDateTime} from "../../utils/dateHelpers";
import ContactLink from "../../components/links/ContactLink";
import {getInitials, trimString} from "../../utils/stringHelpers";
import React from "react";
import {renderStatus, renderSubStatus} from "./widgets";
import {toTitleCase} from "../contacts/types";
import {hasValue} from "../../components/inputs/inputHelpers";
import XLink from "../../components/links/XLink";
import UserLink from "../../components/links/UserLink";

export const wfInitialSort = 'applicationDate';
export const workflowHeadCells: XHeadCell[] = [
    {
        name: 'referenceNumber', label: 'Ref.No',
        render: (value, rec) => <ApplicationLink id={rec.id} name={rec.referenceNumber}/>,
        cellProps: {style: {width: 70}}
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
        name: 'type', label: 'Type',
        render: (value: string, rec: any) => `${toTitleCase(value)}`,
        cellProps: {
            style: {
                width: 60,
                whiteSpace: 'nowrap'
            }
        }
    },
    {
        name: 'status', label: 'Status', render: (data) => renderStatus(data),
        cellProps: {
            style: {
                width: 60
            }
        }
    },
    {
        name: 'subStatus', label: 'SubStatus', render: renderSubStatus,
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
        render: (data, rec) => {
            if (hasValue(rec.metaData.applicantId))
                return <ContactLink
                    id={rec.metaData.applicantId}
                    name={trimString(data, 20)}
                />
            return <XLink
                name={trimString(data, 20)}
                title={data}
            />
        }
    },
    {
        name: 'metaData.assigneeName',
        label: 'Assignee',
        render: (data, {metaData}) => data ? <UserLink id={data} name={getInitials(metaData.assigneeName)} title={metaData.assigneeName}/> : ''
    },
];

export const workflowHeadCellsNew: XHeadCell[]=[...workflowHeadCells.filter(it=>it.name!=='metaData.assigneeName')]


export const workflowTypes = ['JOINT', 'INDIVIDUAL', 'ENTITY','OTHER']
