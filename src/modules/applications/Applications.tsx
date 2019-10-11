import React, {useEffect, useState} from "react";
import Navigation from "../../components/Layout";
import Paper from '@material-ui/core/Paper';
import {createStyles, makeStyles, Theme} from "@material-ui/core";
import clsx from 'clsx';
import XTable from "../../components/table/XTable";
import {XHeadCell} from "../../components/table/XTableHead";
import Grid from '@material-ui/core/Grid';
import ContactLink from "../../components/ContactLink";
import ApplicationLink from "../../components/ApplicationLink";
import {IWorkflowFilter, trimCaseId} from "./types";
import {printDate} from "../../utils/dateHelpers";
import {getInitials} from "../../utils/stringHelpers";
import {printWorkflowStatus, printWorkflowSubStatus} from "./widgets";
import IBox from "../../components/ibox/IBox";
import Filter from "./Filter";
import Typography from "@material-ui/core/Typography";
import {search} from "../../utils/ajax";
import {remoteRoutes} from "../../data/constants";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        drawer: {
            borderRadius: 0,
        },
        content: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            })
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            })
        },
    }),
);

const headCells: XHeadCell[] = [
    {name: 'id', label: 'ID', render: (value, rec) => <ApplicationLink id={value} name={trimCaseId(value)}/>},
    {name: 'applicationDate', label: 'Application Date', render: printDate},
    {name: 'status', label: 'Status', render: (data) => printWorkflowStatus(data)},
    {name: 'subStatus', label: 'SubStatus', render: printWorkflowSubStatus},
    {
        name: 'metaData',
        label: 'Applicant',
        render: (data) => <ContactLink id={data.applicantId} name={data.applicantName}/>
    },
    {
        name: 'userId',
        label: 'User',
        render: (data, {metaData}) => <ContactLink id={data} name={getInitials(metaData.userName)}/>
    },
    {
        name: 'assigneeId',
        label: 'Assignee',
        render: (data, {metaData}) => data ? <ContactLink id={data} name={getInitials(metaData.assigneeName)}/> : ''
    },
];


const Applications = () => {
    const classes = useStyles();
    const [open, setOpen] = useState(true);
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState<IWorkflowFilter>({
        workflowTypes:['ussd-loan']
    });
    useEffect(() => {
        search(remoteRoutes.workflows, filter, resp => {
            setData(resp)
        })
    }, [filter])

    function handleFilterToggle() {
        setOpen(!open);
    }

    function handleFilter(f: IWorkflowFilter) {

    }

    return (
        <Navigation>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant='h3'>Loan Applications</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={open ? 9 : 12} className={clsx(classes.content, {[classes.contentShift]: open})}>
                            <XTable
                                title="All Applications"
                                headCells={headCells}
                                data={data}
                                onFilterToggle={handleFilterToggle}
                            />
                        </Grid>
                        <Grid item xs={3} style={{display: open ? "block" : "none"}}>
                            <Paper className={classes.drawer}>
                                <IBox title='Filter'>
                                    <Filter onFilter={handleFilter}/>
                                </IBox>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

        </Navigation>
    );
}

export default Applications
