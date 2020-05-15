import React, {useCallback, useEffect, useState} from "react";
import ImportExportIcon from '@material-ui/icons/ImportExport';
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
import Button from "@material-ui/core/Button";
import {excelExport, IExcelColumn} from "../../../utils/excelUtils";
import {hasNoValue, hasValue} from "../../../components/inputs/inputHelpers";
import Toast from "../../../utils/Toast";
import {useSelector} from "react-redux";
import {IState} from "../../../data/types";

const headCells: XHeadCell[] = [...columns];

const List = () => {
    const user = useSelector((state: IState) => state.core.user)
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("");

    const fetchData = useCallback((q: string) => {
        setLoading(true)
        search(
            remoteRoutes.users,
            {
                email: q,
                itemsPerPage: 2000
            },
            (resp) => {
                setData(resp)
            },
            undefined,
            () => {
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        fetchData("")
    }, [fetchData])

    function handleFilter(value: string) {
        setQuery(value)
    }

    function handleExport() {
        if (hasNoValue(data)) {
            Toast.warn('No  data to export')
        }
        const columns: IExcelColumn[] = [
            {
                dataKey: 'id',
                title: 'User Id'
            },
            {
                dataKey: 'name',
                title: 'Name'
            },
            {
                dataKey: 'email',
                title: 'Email'
            },
            {
                dataKey: 'phone_number',
                title: 'Phone No.'
            },
            {
                dataKey: 'region',
                title: 'Region Code'
            },
            {
                dataKey: 'branch_name',
                title: 'Branch Sol Id'
            },
            {
                dataKey: 'agent_code',
                title: 'Agent Code'
            }
        ]
        const excelData = data.map(it => {
            const {claims, ...rest} = it
            return {...rest, ...claims}
        })
        excelExport(excelData, columns, "user-list")
    }

    return (
        <Layout>
            <Box p={2}>
                <Grid container spacing={2}>
                    <Grid item sm={12}>
                        <Typography variant='h5'>Users</Typography>
                    </Grid>
                    <Grid item sm={12}>
                        <Box display='flex'>
                            <Box flexGrow={1}>
                                <SearchInput onFilter={handleFilter}/>
                            </Box>
                            <Box pl={2}>
                                <Button
                                    startIcon={<ImportExportIcon/>}
                                    size='medium'
                                    variant='outlined'
                                    color='primary'
                                    onClick={handleExport}
                                >Export</Button>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <XTable
                            loading={loading}
                            headCells={headCells}
                            data={data.filter(it => localFilter(it, query))}
                            initialRowsPerPage={10}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    );
}

export default List
