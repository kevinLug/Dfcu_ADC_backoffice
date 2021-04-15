import React, {useEffect, useState} from "react";
import Navigation from "../../components/Layout";
import Paper from '@material-ui/core/Paper';
import {Button, createStyles, makeStyles, Theme} from "@material-ui/core";
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
import Toolbar from "@material-ui/core/Toolbar";
import ModalDialog from "../../utils/ModalTemplate";
import ScanCrop from "../scan/ScanCrop";
import {useDispatch, useSelector} from "react-redux";
import {IState} from "../../data/types";
import {Dispatch} from "redux";
import {startNewTransferRequest} from "../../data/redux/coreActions";
import Loading from "../../components/Loading";

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

const NegotiateTransferRequestAndList = () => {

}

const Workflows = () => {
    const classes = useStyles();
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadingNew, setLoadingNew] = useState(false);
    const [newData, setNewData] = useState([]);
    const [data, setData] = useState([]);
    const [openDialog,setOpenDialog] = useState(false)
    // const startNewTransferRequest = useSelector((state: IState) => state.core.startNewTransferRequest);

    // console.log('startNewTransferRequest', startNewTransferRequest)
    const isNewTransferRequestStarted: boolean = useSelector((state: IState) => state.core.startNewTransferRequest)
    console.log('interrupt',isNewTransferRequestStarted);

    const [filter, setFilter] = useState<IWorkflowFilter>({
        workflowTypes: workflowTypes,
        showNew: false,
        showAssigned: true
    });

    useEffect(() => {
        setLoadingNew(true)
        const newFilter = {
            workflowTypes: workflowTypes
        };
        search(remoteRoutes.workflows, newFilter, resp => {
            setNewData(resp)
        }, undefined, () => {
            setLoadingNew(false)
        })
    }, [])

    function handleFilterToggle() {
        setOpen(!open);
    }

    function handleFilter(f: IWorkflowFilter) {
        setFilter({...filter, ...f})
    }

    function onClose(){
        setOpenDialog(false)
    }

    function pickImage()  {
        setOpenDialog(true)
    }

    return (
        <Navigation>
            <Grid container spacing={3}>
                <Grid item xs={12} className={clsx(classes.content, {[classes.contentShift]: open})}>
                    <Grid container spacing={2}>

                        {
                            !isNewTransferRequestStarted?
                                <Grid item sm={6}>
                                    <Typography variant='h4'>All Applications</Typography>
                                </Grid> :

                                <Grid item sm={6}>
                                    <Typography variant='h4'>Validate money transfer request</Typography>
                                </Grid>
                        }

                        {
                            !isNewTransferRequestStarted?
                                <Grid item sm={12}>

                                    <Filter onFilter={handleFilter} loading={loading}/>

                                </Grid> : ""
                        }

                        <Grid item xs={12}>

                            {
                                isNewTransferRequestStarted? <ScanCrop /> :
                                    <XTable
                                        loading={loadingNew}
                                        headCells={workflowHeadCellsNew}
                                        data={newData}
                                        initialRowsPerPage={3}
                                        usePagination={true}
                                        initialSortBy={wfInitialSort}
                                        initialOrder="desc"
                                    />
                            }

                        </Grid>
                    </Grid>
                </Grid>

            </Grid>

        </Navigation>
    );
}

export default Workflows
