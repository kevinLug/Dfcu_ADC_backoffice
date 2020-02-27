import React, {useEffect, useState} from "react";
import Layout from "../../../components/Layout";

import XTable from "../../../components/table/XTable";
import {XHeadCell} from "../../../components/table/XTableHead";
import Grid from '@material-ui/core/Grid';

import {search} from "../../../utils/ajax";
import {remoteRoutes} from "../../../data/constants";
import Typography from "@material-ui/core/Typography";
import {useDispatch, useSelector} from "react-redux";
import {IState} from "../../../data/types";
import {columns, localFilter} from "./config";
import {IUserState, userConstants} from "../../../data/redux/users/reducer";
import {Box} from "@material-ui/core";
import SearchInput from "../../../components/SearchInput";

const headCells: XHeadCell[] = [...columns];

const List = () => {
    const dispatch = useDispatch();
    const [editDialog, setEditDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const {data}: IUserState = useSelector((state: IState) => state.users)
    const [displayData, setDisplayData] = useState([]);
    const [filter, setFilter] = useState<any>("");

    useEffect(() => {
        search(
            remoteRoutes.users,
            {
                ItemsPerPage: 200
            },
            (resp) => {
                dispatch({
                    type: userConstants.usersCommitFetch,
                    payload: [...resp],
                })
            },
            undefined,
            () => {
                setLoading(false)
            })
    }, [dispatch])


    function handleFilter(value: any) {
        setFilter(value)
    }

    function handleEdit() {
        setEditDialog(true)
    }

    function handleClose() {
        setEditDialog(false)
    }

    return (
        <Layout>
            <Box p={2}>
                <Grid container spacing={2}>
                    <Grid item sm={12}>
                        <Typography variant='h5'>Users</Typography>
                    </Grid>
                    <Grid item sm={12}>
                        <SearchInput onFilter={handleFilter}/>
                    </Grid>
                    <Grid item xs={12}>
                        <XTable
                            headCells={headCells}
                            data={data.filter(it => localFilter(it, filter))}
                            initialRowsPerPage={10}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    );
}

export default List
