import React, {useEffect, useState} from 'react';
import {RouteComponentProps, withRouter} from "react-router";
import Navigation from "../../../components/Navigation";
import {getRouteParam} from "../../../utils/routHelpers";
import {fakeContact, IContact} from "../types";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import {createStyles, Grid, makeStyles, Theme} from "@material-ui/core";
import Divider from '@material-ui/core/Divider';
import Profile from "./Profile";
import Paper from "@material-ui/core/Paper";
import IdInfo from "./IdInfo";
import Emails from "./Emails";
import Phones from "./Phones";
import Addresses from "./Addresses";

interface IProps extends RouteComponentProps {

}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(2),
            borderRadius: 0,
            height: '100%'
        },
        divider: {
            marginTop: theme.spacing(2)
        }
    })
);

const Details = (props: IProps) => {
    const contactId = getRouteParam(props, 'contactId')
    const classes = useStyles()
    const [data, setData] = useState<IContact | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setData(fakeContact())
        }, 500)
    }, [contactId])
    const hasError = !loading && !data
    return (
        <Navigation>
            {loading && <Loading/>}
            {hasError && <Error text='Failed load contact'/>}
            {
                data &&
                <Paper className={classes.root}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Profile data={data}/>
                            <Divider className={classes.divider}/>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <IdInfo data={data}/>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={4}>
                                    <Emails data={data}/>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Phones data={data}/>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Addresses data={data}/>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            }
        </Navigation>
    );
}

export default withRouter(Details);
