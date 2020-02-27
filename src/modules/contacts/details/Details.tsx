import React, {useEffect, useState} from 'react';
import {RouteComponentProps, withRouter} from "react-router";
import Layout from "../../../components/Layout";
import {getRouteParam} from "../../../utils/routHelpers";
import {IContact} from "../types";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import {createStyles, Grid, makeStyles, Theme} from "@material-ui/core";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Profile from "./info/Profile";
import Info from "./info/Info";
import {get} from "../../../utils/ajax";
import {remoteRoutes} from "../../../data/constants";
import {useDispatch, useSelector} from "react-redux";
import {crmConstants} from "../../../data/redux/contacts/reducer";

interface IProps extends RouteComponentProps {

}


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(1),
            borderRadius: 0,
            minHeight: '100%',
            overflow: 'show'
        },
        divider: {
            marginTop: theme.spacing(2)
        },
        noPadding: {
            padding: 0
        }
    })
);



const Details = (props: IProps) => {
    const contactId = getRouteParam(props, 'contactId')
    const classes = useStyles()
    const dispatch = useDispatch();
    const data: IContact | undefined = useSelector((state: any) => state.crm.selected)

    const [loading, setLoading] = useState<boolean>(true)
    const [value, setValue] = React.useState('one');

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setValue(newValue);
    };
    useEffect(() => {
        setLoading(true)
        get(
            `${remoteRoutes.contacts}/${contactId}`,
            resp => dispatch({
                type: crmConstants.crmFetchOne,
                payload: resp,
            }),
            undefined,
            () => setLoading(false))
    }, [dispatch, contactId])
    const hasError = !loading && !data
    return (
        <Layout>
            {loading && <Loading/>}
            {hasError && <Error text='Failed load contact'/>}
            {
                data &&
                <div className={classes.root}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} style={{paddingBottom: 0}}>
                            <Profile data={data}/>
                            <Divider className={classes.divider}/>
                        </Grid>
                        <Grid item xs={12} style={{paddingTop: 0}}>
                            <Info data={data}/>
                        </Grid>
                    </Grid>
                </div>
            }
        </Layout>
    );
}

export default withRouter(Details);
