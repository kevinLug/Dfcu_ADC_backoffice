import React, {useEffect, useState} from "react";
import Layout from "../../../components/Layout";
import XTable from "../../../components/table/XTable";
import {XHeadCell} from "../../../components/table/XTableHead";
import Grid from '@material-ui/core/Grid';
import {search} from "../../../utils/ajax";
import {remoteRoutes} from "../../../data/constants";
import Typography from "@material-ui/core/Typography";
import {columns, localFilter} from "./config";
import {Box} from "@material-ui/core";
import SearchInput from "../../../components/SearchInput";

const headCells: XHeadCell[] = [...columns];

const List = () => {

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState<any>("");

    useEffect(() => {
        setLoading(true)
        search(
            remoteRoutes.users,
            {
                email: filter,
                itemsPerPage: 500
            },
            (resp) => {
                setData(resp)
            },
            undefined,
            () => {
                setLoading(false)
            })
    }, [filter])

    function handleFilter(value: any) {
        setFilter(value)
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
                            loading={loading}
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
