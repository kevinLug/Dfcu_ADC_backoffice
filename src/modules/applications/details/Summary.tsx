import React from 'react';
import {Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {IWorkflow} from "../types";
import DetailView, {IRec} from "../../../components/DetailView";
import {printDateTime} from "../../../utils/dateHelpers";

interface IProps {
    data: IWorkflow
}

const Summary = ({data}: IProps) => {

    const fields: IRec[] = [
        {
            label: 'Application Date',
            value: printDateTime(data.applicationDate)
        },
        {
            label: 'Id',
            value: data.id
        },
        {
            label: 'Title',
            value: data.title
        },
        {
            label: 'External Ref',
            value: data.externalReference
        },
        {
            label: 'Ref Number',
            value: data.referenceNumber
        },
        {
            label: 'User',
            value: data.metaData.userName
        },
        {
            label: 'Assignee',
            value: data.metaData.assigneeName
        },
        {
            label: 'Assigned On',
            value: printDateTime(data.assignedDate)
        },
        {
            label: '',
            value: ''
        },
        {
            label: 'Status',
            value: data.status
        },
        {
            label: 'Sub-status',
            value: data.subStatus
        },
        {
            label: 'Status Comment',
            value: data.subStatusComment
        },
        {
            label: 'Last Run',
            value: printDateTime(data.runDate)
        }
    ]
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} style={{minWidth: 300, overflow: 'auto'}}>
                <div style={{minWidth: 300, overflow: 'auto'}}>
                    <DetailView data={fields}/>
                </div>
            </Grid>
        </Grid>
    );
}


export default Summary;
