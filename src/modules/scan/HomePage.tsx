import React, {useEffect, useState} from 'react'
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Filter from "../workflows/Filter";
import XTable from "../../components/table/XTable";
import {IWorkflowFilter} from "../workflows/types";
import {search} from "../../utils/ajax";
import {remoteRoutes} from "../../data/constants";
import {wfInitialSort, workflowHeadCellsNew, workflowTypes} from "../workflows/config";
import Workflows from "../workflows/Workflows";


const HomePage = () => {

    const [open, setOpen] = useState(true);
    const [loadingFilter, setLoadingFilter] = useState(false);
    const [loadingNew, setLoadingNew] = useState(false);
    const [data, setData] = useState([]);

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
        search(remoteRoutes.workflows, newFilter, () => {

        }, undefined, () => {
            setLoadingNew(false)
        })
    }, [])

    useEffect(() => {
        setLoadingFilter(true)
        search(remoteRoutes.workflows, filter, resp => {
            setData(resp)
        }, undefined, () => setLoadingFilter(false))

    }, [filter])

    function handleFilterToggle() {
        setOpen(!open);
    }

    function handleFilter(f: IWorkflowFilter) {
        setFilter({...filter, ...f})
    }

    return <Workflows>

        <Grid container spacing={2}>

            <Grid item sm={6}>
                <Typography variant='h4'>All Applications</Typography>
            </Grid>

            <Grid item sm={12}>

                <Filter onFilter={handleFilter} loading={loadingFilter}  filterResult={data}/>

            </Grid>

            <Grid item xs={12}>

                        <XTable
                            loading={loadingNew}
                            headCells={workflowHeadCellsNew}
                            data={data}
                            initialRowsPerPage={5}
                            usePagination={true}
                            onFilterToggle={handleFilterToggle}
                            initialSortBy={wfInitialSort}
                            initialOrder="desc"
                        />

            </Grid>

        </Grid>
    </Workflows>
}

export default HomePage