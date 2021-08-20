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
    const [loadingFilter, setLoadingFilter] = useState(false);
    const [loadingNew, setLoadingNew] = useState(false);
    const [newData, setNewData] = useState([]);
    const [data, setData] = useState([]);
    const [openDialog, setOpenDialog] = useState(false)
    const [populateWithFilterResult, setPopulateWithFilterResult] = useState(false)

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
            console.log("homepage search-new:",resp, newFilter )
        }, undefined, () => {
            setLoadingNew(false)
        })
    }, [])

    useEffect(() => {
        setLoadingFilter(true)
        search(remoteRoutes.workflows, filter, resp => {
            console.log("the filtered-filter:,,,", filter)
            console.log("the filtered:,,,", resp)
            //setData(resp)
            console.log("homepage search:",resp , filter)
        }, undefined, () => setLoadingFilter(false))

        console.log('loading filter: ',loadingFilter, newData, data, populateWithFilterResult)

    }, [filter,data,populateWithFilterResult])

    function handleFilterToggle() {
        setOpen(!open);
        console.log('gates of hades:', open)
    }

    function handleFilter(f: IWorkflowFilter) {
        console.log('setting filter:', f)
        setFilter({...filter, ...f})
        setPopulateWithFilterResult(true)
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

                <Filter onFilter={handleFilter} loading={loadingFilter} setFilteredData={setData} setSearchIsHappening={setPopulateWithFilterResult} />

            </Grid>

            <Grid item xs={12}>

                {
                    populateWithFilterResult ?
                        <XTable
                            loading={loadingFilter}
                            headCells={workflowHeadCellsNew}
                            data={data}
                            initialRowsPerPage={5}
                            usePagination={true}
                            onFilterToggle={handleFilterToggle}
                            initialSortBy={wfInitialSort}
                            initialOrder="desc"

                        />
                        :
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