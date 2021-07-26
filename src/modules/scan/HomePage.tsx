import React, {useEffect, useState} from 'react'
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Filter from "../workflows/Filter";
import XTable from "../../components/table/XTable";
import {IWorkflowFilter} from "../workflows/types";
import {search} from "../../utils/ajax";
import {remoteRoutes} from "../../data/constants";
import {wfInitialSort, workflowHeadCells, workflowHeadCellsNew, workflowTypes} from "../workflows/config";
import Workflows from "../workflows/Workflows";


const HomePage = () => {

    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadingNew, setLoadingNew] = useState(false);
    const [newData, setNewData] = useState([]);
    const [data, setData] = useState([]);
    const [openDialog, setOpenDialog] = useState(false)

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

    function onClose() {
        setOpenDialog(false)
    }

    function pickImage() {
        setOpenDialog(true)
    }

    return <Workflows>

        <Grid container spacing={2}>

            <Grid item sm={6}>
                <Typography variant='h4'>All Applications</Typography>
            </Grid> :

            {/*<Grid item sm={6}>*/}
            {/*    <Typography variant='h4'>Validate money transfer request</Typography>*/}
            {/*</Grid>*/}

            <Grid item sm={12}>

                <Filter onFilter={handleFilter} loading={loading}/>

            </Grid>

            <Grid item xs={12}>

                {
                    <XTable
                        loading={loadingNew}
                        headCells={workflowHeadCellsNew}
                        data={newData}
                        initialRowsPerPage={5}
                        usePagination={true}
                        initialSortBy={wfInitialSort}
                        initialOrder="desc"
                    />
                }

            </Grid>

        </Grid>
    </Workflows>
}

export default HomePage