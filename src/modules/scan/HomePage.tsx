import React, { useEffect, useState } from 'react'
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Filter from "../workflows/Filter";
import XTable from "../../components/table/XTable";
import { IWorkflowFilter } from "../workflows/types";
import { search } from "../../utils/ajax";
import { remoteRoutes } from "../../data/constants";
import { wfInitialSort, workflowHeadCellsNew, workflowTypes } from "../workflows/config";
import Workflows from "../workflows/Workflows";


import DataAccessConfigs from '../../data/dataAccessConfigs';
import AlertDialogForMessages from './AlertDialog';
import { addDynamicPropertyToObject, isNullOrEmpty, isNullOrUndefined } from '../../utils/objectHelpers';
import { useSelector } from 'react-redux';
import { IState } from '../../data/types';

const HomePage = () => {

    const [open, setOpen] = useState(true);
    const user = useSelector((state: IState) => state.core.user)
    const [isReadyToDisplay, setReadyToDisplay] = useState(DataAccessConfigs.isBranchOfUserSelected(user));
    const [loadingFilter, setLoadingFilter] = useState(false);
    const [loadingNew, setLoadingNew] = useState(false);
    const [data, setData] = useState([]);
    const [openSnackBarCustomMessage, setOpenSnackBarCustomMessage] = useState(false)
    const [branchMissingMessage, setBranchMissingMessage] = useState('')

    const [filter, setFilter] = useState<IWorkflowFilter>({
        workflowTypes: workflowTypes,
        showNew: false,
        showAssigned: true
    });

    useEffect(() => {

        if (isReadyToDisplay) {
            setLoadingNew(true)
            const newFilter = {
                workflowTypes: workflowTypes,
            };

            const result = DataAccessConfigs.getBranchOfUserSelected()!;

            if (!isNullOrEmpty(result) && !isNullOrUndefined(result)) {
                addDynamicPropertyToObject(newFilter, 'branchCode', JSON.parse(result)['branchCode'])
            }

            search(remoteRoutes.workflows, newFilter, () => {

            }, undefined, () => {
                setLoadingNew(false)
            })
        }
        else {
            setOpenSnackBarCustomMessage(true)
            setBranchMissingMessage('Please select your branch from the branch list for you to continue')
        }

    }, [])

    useEffect(() => {

        if (isReadyToDisplay) {
            const result = DataAccessConfigs.getBranchOfUserSelected()!;

            if (!isNullOrEmpty(result) && !isNullOrUndefined(result)) {
                const r = JSON.parse(result)


                filter.branchCode = JSON.parse(result)['branchCode']
            }

            setLoadingFilter(true)
            search(remoteRoutes.workflows, filter, resp => {
                setData(resp)
            }, undefined, () => setLoadingFilter(false))
        }
        else {
            setOpenSnackBarCustomMessage(true)
            setBranchMissingMessage('Please select your branch')
        }

    }, [filter, isReadyToDisplay, openSnackBarCustomMessage])

    function handleFilterToggle() {
        setOpen(!open);
    }

    function handleFilter(f: IWorkflowFilter) {
        setFilter({ ...filter, ...f })
    }

    function showSnackBarMessageCustom(msg: string) {
        return openSnackBarCustomMessage ? <AlertDialogForMessages messages={[msg]} title="Message" shouldOpen={openSnackBarCustomMessage} /> : ""
    }

    return <Workflows>

        <Grid container spacing={2}>

            <Grid item sm={6}>
                <Typography variant='h4'>All Applications</Typography>
            </Grid>

            <Grid item sm={12}>

                <Filter onFilter={handleFilter} loading={loadingFilter} filterResult={data} />

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

            {
                showSnackBarMessageCustom(branchMissingMessage)
            }

        </Grid>
    </Workflows>
}

export default HomePage