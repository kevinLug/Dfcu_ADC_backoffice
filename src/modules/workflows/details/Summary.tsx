import React, {Fragment} from 'react';
import {Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {ITask, IWorkflow, TaskStatus} from "../types";
import DetailView, {IRec} from "../../../components/DetailView";
import {printDateTime} from "../../../utils/dateHelpers";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import LabelIcon from '@material-ui/icons/Label';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from "@material-ui/core/Divider";
import {errorColor, successColor, warningColor} from "../../../theme/custom-colors";

interface IProps {
    data: IWorkflow
    onTaskClick?: (id: string) => any
}

const Summary = ({data, onTaskClick}: IProps) => {

    const fields: IRec[] = [
        {
            label: 'Application Date',
            value: printDateTime(data.applicationDate)
        },
        {
            label: 'Type',
            value: data.type
        },
        {
            label: 'Product',
            value: data.metaData.product
        },
        {
            label: 'Currency',
            value: data.metaData.currency
        },
        {
            label: 'Ref Number',
            value: data.referenceNumber
        },
        {
            label: 'Agent',
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
    ]

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <div style={{minWidth: '100%', overflow: 'auto'}}>
                    <DetailView data={fields}/>
                </div>
            </Grid>
            <Grid item xs={12}>
                <Typography>Request Status</Typography>
                <List dense>
                    {
                        data.tasks.map(it => (
                            <Fragment key={it.name}>
                                <ListItem onClick={() => onTaskClick && onTaskClick(it.id)}>
                                    <ListItemIcon>
                                        <LabelIcon style={{color: getTaskColor(it)}}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={it.title}
                                    />
                                </ListItem>
                                <Divider/>
                            </Fragment>

                        ))
                    }
                </List>
            </Grid>
        </Grid>
    );
}

export function getTaskColor(task: ITask): any {
    switch (task.status) {
        case TaskStatus.Done:
            return successColor
        case TaskStatus.Error:
            return errorColor
        case TaskStatus.Pending:
            return warningColor
    }
}


export default Summary;
