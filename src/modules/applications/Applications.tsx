import React, {useState} from "react";
import Navigation from "../../components/Navigation";
import Paper from '@material-ui/core/Paper';
import {createStyles, makeStyles, Theme} from "@material-ui/core";
import clsx from 'clsx';
import XTable from "../../components/table/XTable";
import {XHeadCell} from "../../components/table/XTableHead";
import Grid from '@material-ui/core/Grid';
import ContactLink from "../../components/ContactLink";
import ApplicationLink from "../../components/ApplicationLink";
import {IWorkflow,  trimCaseId} from "./types";
import {printDate} from "../../utils/dateHelpers";
import {fakeCase} from "./fakeData";
import {getInitials} from "../../utils/stringHelpers";
import {printWorkflowStatus, printWorkflowSubStatus} from "./widgets";
import IBox from "../../components/ibox/IBox";
import Filter from "./Filter";

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
    {name: 'status', label: 'Status', render: (data) => printWorkflowStatus(data)},
    {name: 'subStatus', label: 'SubStatus', render: printWorkflowSubStatus},
    {name: 'type', label: 'Case Type', render: (data: string) => data.toLocaleUpperCase()},
    {name: 'applicationDate', label: 'Application Date', render: printDate},
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

const newHeadCells = headCells.filter(it => it.name !== 'assigneeId')

const fakeData: IWorkflow[] = [];
for (let i = 0; i < 20; i++) {
    fakeData.push(fakeCase())
}
const Contacts = () => {
    const [open, setOpen] = useState(true);
    const [data, setData] = useState(fakeData);
    const classes = useStyles();

    function handleFilterToggle() {
        setOpen(!open);
    }

    return (
        <Navigation>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <XTable
                        title="New Applications"
                        headCells={newHeadCells}
                        data={data}
                        initialRowsPerPage={5}
                    />
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
                                    <Filter/>
                                </IBox>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

        </Navigation>
    );
}

export default Contacts
