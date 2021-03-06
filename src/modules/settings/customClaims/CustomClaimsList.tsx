import React, {useCallback, useEffect, useState} from "react";
import Layout from "../../../components/Layout";

import XTable from "../../../components/table/XTable";
import {XHeadCell} from "../../../components/table/XTableHead";
import Grid from '@material-ui/core/Grid';

import {search} from "../../../utils/ajax";
import {remoteRoutes} from "../../../data/constants";
import Typography from "@material-ui/core/Typography";
import {
    authCustomClaims,
    createEditColumns,
    customClaimsSchema,
    fromAuthCustomClaimObject,
    toAuthCustomClaimObject
} from "./config";
import {Box} from "@material-ui/core";
import SearchInput from "../../../components/SearchInput";

import EditIconButton from "../../../components/EditIconButton";
import EditDialog from "../../../components/EditDialog";
import EditForm from "../../../components/dynamic-editor/EditForm";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import {Alert} from "@material-ui/lab";
import CsvReader from "./CsvReader";
import CsvDialog from "./CsvDialog";
import {hasNoValue} from "../../../components/inputs/inputHelpers";
import {debounce} from "lodash";


const CustomClaimsList = () => {
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<any | null>(null)
    const [dialog, setDialog] = useState(false)
    const [bulk, setBulk] = useState(false)
    const [data, setData] = useState<any []>([])
    const [filter, setFilter] = useState<any>({});

    const fetchData = useCallback((f: any) => {
        console.log("Fetching data")
        debounce(() => {
            console.log("Calling debouced")
        }, 300)
        setLoading(true)
        search(remoteRoutes.userCustomClaims, f,
            (resp) => {
                setData(resp.map(fromAuthCustomClaimObject))
            },
            undefined,
            () => {
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        fetchData(filter)
    }, [filter])


    function handleClaimsAdded() {
        fetchData(filter)
    }

    function handleFilter(value: string) {
        if (hasNoValue(value)) {
            setFilter({query: ""})
            return;
        }
        if (value.length >= 3) {
            setFilter({query: value})
        }
    }

    const handleEdit = (dt: any) => () => {
        setSelected(dt)
        setDialog(true)
    }

    const handleCloseBulk = () => {
        setBulk(false)
    }

    const handleBulkAdd = () => {
        setBulk(true)
    }

    const handleClose = () => {
        setDialog(false)
        setSelected(null)
    }

    const handleAdd = () => {
        setSelected(null)
        setDialog(true)
    }

    function handleAdded(dt: any) {
        setData([...data, dt])
        handleClose()
    }

    function handleEdited(dt: any) {
        const newData = data.map(it => it.id === dt.id ? dt : it)
        setData(newData)
        handleClose()
    }

    function handleDeleted(dt: any) {
        const newData = data.filter(it => it.id !== dt.id)
        setData(newData)
        handleClose()
    }


    const createColumns = (): XHeadCell[] => {
        const toReturn: XHeadCell[] = [
            {name: "email", label: 'email'}
        ]
        authCustomClaims.forEach(({name, label}) => {
            toReturn.push({
                name,
                label
            })
        })
        toReturn.push({
            name: "action", label: 'Actions',
            render: (_, rec) => <EditIconButton onClick={handleEdit(rec)}/>
        })
        return toReturn;
    }
    const isNew = !selected
    const editColumns = createEditColumns(isNew)

    return (
        <Layout>
            <Box p={2}>
                <Grid container spacing={2}>
                    <Grid item sm={3}>
                        <Box pt={2}>
                            <Typography variant='h5'>Custom claims</Typography>
                        </Box>
                    </Grid>
                    <Grid item sm={9}>
                        <Alert severity="warning">These claims only apply if a user has never logged in and they will be
                            deleted after the user logs in!</Alert>
                    </Grid>
                    <Grid item sm={9}>
                        <SearchInput onFilter={handleFilter}/>
                    </Grid>
                    <Grid item sm={3}>
                        <Box pt={1} display="flex" justifyContent="center">
                            <Box>
                                <Button
                                    startIcon={<AddIcon/>}
                                    size='medium'
                                    variant='outlined'
                                    color='primary'
                                    onClick={handleAdd}
                                >Add New</Button>
                            </Box>
                            <Box pl={2}>
                                <Button
                                    startIcon={<AddIcon/>}
                                    size='medium'
                                    variant='outlined'
                                    color='primary'
                                    onClick={handleBulkAdd}
                                >Bulk Add</Button>
                            </Box>
                        </Box>

                    </Grid>
                    <Grid item xs={12}>
                        <XTable
                            loading={loading}
                            headCells={createColumns()}
                            data={data}
                            initialRowsPerPage={10}
                            primaryKey='email'
                        />
                    </Grid>
                </Grid>
                <EditDialog open={dialog} onClose={handleClose} title='Edit custom claims'>
                    <EditForm
                        columns={editColumns}
                        url={remoteRoutes.userCustomClaims}
                        data={isNew ? {} : selected}
                        isNew={isNew}
                        onNew={handleAdded}
                        onEdited={handleEdited}
                        onDeleted={handleDeleted}
                        submitParser={toAuthCustomClaimObject}
                        submitResponseParser={fromAuthCustomClaimObject}
                        schema={customClaimsSchema()}
                        primaryKey="email"
                    />
                </EditDialog>
                <CsvDialog open={bulk} onClose={handleCloseBulk}>
                    <CsvReader done={handleClaimsAdded}/>
                </CsvDialog>
            </Box>
        </Layout>
    );
}

export default CustomClaimsList
