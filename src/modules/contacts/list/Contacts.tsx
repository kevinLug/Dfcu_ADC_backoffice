import React, {useEffect, useState} from "react";
import Layout from "../../../components/Layout";
import Paper from '@material-ui/core/Paper';
import {createStyles, makeStyles, Theme} from "@material-ui/core";
import {IContactsFilter} from "../types";
import XTable from "../../../components/table/XTable";
import {XHeadCell} from "../../../components/table/XTableHead";
import Grid from '@material-ui/core/Grid';
import Filter from "./Filter";
import {search} from "../../../utils/ajax";
import {remoteRoutes} from "../../../data/constants";
import Loading from "../../../components/Loading";
import Box from "@material-ui/core/Box";
import EditDialog from "../../../components/EditDialog";
import NewPersonForm from "../forms/NewPersonForm";
import Typography from "@material-ui/core/Typography";
import {useDispatch, useSelector} from "react-redux";
import {crmConstants, ICrmState} from "../../../data/redux/contacts/reducer";
import RecentContacts from "./RecentContacts";
import {IState} from "../../../data/types";
import {columns} from "./config";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        filterPaper: {
            borderRadius: 0,
            padding: theme.spacing(2)
        },
        fab: {
            position: 'absolute',
            bottom: theme.spacing(2),
            right: theme.spacing(2),
        },
    }),
);

const headCells: XHeadCell[] = [...columns];

const Contacts = () => {
    const dispatch = useDispatch();
    const [createDialog, setCreateDialog] = useState(false);
    const {data, loading}: ICrmState = useSelector((state: IState) => state.crm)

    const [filter, setFilter] = useState<IContactsFilter>({});
    const classes = useStyles();

    useEffect(() => {
        dispatch({
            type: crmConstants.crmFetchLoading,
            payload: true,
        })
        search(
            remoteRoutes.contacts,
            filter,
            (resp) => {
                dispatch({
                    type: crmConstants.crmFetchAll,
                    payload: [...resp],
                })
            },
            undefined,
            () => {
                dispatch({
                    type: crmConstants.crmFetchLoading,
                    payload: false,
                })
            })
    }, [filter, dispatch])


    function handleFilter(value: any) {
        setFilter({...filter, ...value})
    }

    function handleNew() {
        setCreateDialog(true)
    }



    function closeCreateDialog() {
        setCreateDialog(false)
    }

    return (
        <Layout>
            <Grid container spacing={2}>
                <Grid item xs={9}>
                    <RecentContacts/>
                    <Box p={1} className={classes.root}>
                        <Box pb={2}>
                            <Grid container>
                                <Grid item sm={12}>
                                    <Typography variant='h5'>Contacts</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                        {
                            loading ? <Loading/> :
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <XTable
                                            headCells={headCells}
                                            data={data}
                                            initialRowsPerPage={10}
                                        />
                                    </Grid>
                                </Grid>
                        }
                    </Box>
                </Grid>
                <Grid item xs={3} >
                    <Box pb={2}>
                        <Typography variant='h5'>&nbsp;</Typography>
                    </Box>
                    <Box pt={1}>
                        <Paper className={classes.filterPaper} elevation={0}>
                            <Filter onFilter={handleFilter} loading={loading}/>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
            <EditDialog title="New Person" open={createDialog} onClose={closeCreateDialog}>
                <NewPersonForm data={{}} done={closeCreateDialog}/>
            </EditDialog>
        </Layout>
    );
}

export default Contacts
