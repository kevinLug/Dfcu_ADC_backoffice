import React, {useEffect, useState} from "react";
import Navigation from "../../components/Layout";
import Paper from '@material-ui/core/Paper';
import {createStyles, makeStyles, Theme} from "@material-ui/core";
import clsx from 'clsx';
import XTable from "../../components/table/XTable";
import Grid from '@material-ui/core/Grid';
import {IWorkflowFilter} from "./types";
import Filter from "./Filter";
import Typography from "@material-ui/core/Typography";
import {search} from "../../utils/ajax";
import {remoteRoutes} from "../../data/constants";
import {wfInitialSort, workflowHeadCells, workflowHeadCellsNew, workflowTypes} from "./config";
import Box from "@material-ui/core/Box";

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




const Workflows = () => {
    const classes = useStyles();
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadingNew, setLoadingNew] = useState(false);
    const [newData, setNewData] = useState([]);
    const [data, setData] = useState([]);

    const [filter, setFilter] = useState<IWorkflowFilter>({
        workflowTypes: workflowTypes,
        showNew: false,
        showAssigned: true
    });


    useEffect(() => {
        setLoadingNew(true)
        const newFilter = {
            workflowTypes: workflowTypes,
            showNew: true,
            showAssigned: false
        };
        search(remoteRoutes.workflows, newFilter, resp => {
            setNewData(resp)
        }, undefined, () => {
            setLoadingNew(false)
        })
    }, [])

    useEffect(() => {
        console.log("Filter", filter)
        setLoading(true)
        search(remoteRoutes.workflows, filter, resp => {
            setData(resp)
        }, undefined, () => setLoading(false))
    }, [filter])

    function handleFilterToggle() {
        setOpen(!open);
    }

    function handleFilter(f: IWorkflowFilter) {
        setFilter({...filter, ...f})
    }

    return (
        <Navigation>
            <Grid container spacing={3}>
                <Grid item xs={open ? 9 : 12} className={clsx(classes.content, {[classes.contentShift]: open})}>
                    <Grid container spacing={2}>
                        <Grid item sm={12}>
                            <Typography variant='h4'>New Applications</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <XTable
                                loading={loadingNew}
                                headCells={workflowHeadCellsNew}
                                data={newData}
                                initialRowsPerPage={3}
                                usePagination={true}
                                initialSortBy={wfInitialSort}
                                initialOrder="desc"
                            />
                        </Grid>
                        <Grid item sm={12}>
                            <Typography variant='h4'>All Applications</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <XTable
                                loading={loading}
                                headCells={workflowHeadCells}
                                data={data}
                                onFilterToggle={handleFilterToggle}
                                initialSortBy={wfInitialSort}
                                initialOrder="desc"
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={3} style={{display: open ? "block" : "none"}}>
                    <Grid container spacing={2}>
                        <Grid item sm={12}>
                            <Typography variant='h4'>&nbsp;</Typography>
                        </Grid>
                        <Grid item sm={12}>
                            <Paper elevation={0} style={{borderRadius: 0}}>
                                <Box p={2}>
                                    <Filter onFilter={handleFilter} loading={loading}/>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>

                </Grid>
            </Grid>
        </Navigation>
    );
}

export default Workflows
