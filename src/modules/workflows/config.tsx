import {XHeadCell} from "../../components/table/XTableHead";
import ApplicationLink from "../../components/links/ApplicationLink";
import {trimCaseId} from "./types";
import {printDateTime} from "../../utils/dateHelpers";
import ContactLink from "../../components/links/ContactLink";
import {getInitials, trimString} from "../../utils/stringHelpers";
import React from "react";
import {renderStatus, renderSubStatus} from "./widgets";

export const workflowHeadCells: XHeadCell[] = [
    {
        name: 'id', label: 'ID', render: (value, rec) => <ApplicationLink id={value} name={trimCaseId(value)}/>,
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
        name: 'type', label: 'Type', render: (value:string)=>value.toLocaleLowerCase(),
        cellProps: {
            style: {
                width: 100,
                whiteSpace: 'nowrap'
            }
        }
    },
    {
        name: 'status', label: 'Status', render: (data) => renderStatus(data),
        cellProps: {
            style: {
                width: 30
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
        name: 'metaData',
        label: 'Applicant',
        render: (data) => <ContactLink id={data.applicantId} name={trimString(data.applicantName, 20)}/>
    },
    {
        name: 'assigneeId',
        label: 'Assignee',
        render: (data, {metaData}) => data ? <ContactLink id={data} name={getInitials(metaData.assigneeName)}/> : ''
    },
];
