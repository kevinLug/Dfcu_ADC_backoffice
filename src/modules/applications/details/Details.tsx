import React, {useEffect, useState} from 'react';
import {RouteComponentProps, withRouter} from "react-router";
import Navigation from "../../../components/Navigation";
import {getRouteParam} from "../../../utils/routHelpers";

import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import {createStyles, Grid, makeStyles, Theme} from "@material-ui/core";
import Divider from '@material-ui/core/Divider';

import Paper from "@material-ui/core/Paper";
import {fakeCase} from "../fakeData";
import {IWorkflow, trimCaseId} from "../types";
import Typography from "@material-ui/core/Typography";
import IBox from "../../../components/ibox/IBox";
import MailIcon from "@material-ui/core/SvgIcon/SvgIcon";
import {Flex} from "../../../components/widgets";
import {printWorkflowStatus, printWorkflowSubStatus} from "../widgets";


interface IProps extends RouteComponentProps {

}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(2),
            borderRadius: 0,
            height:'100%'
        },
        divider: {
            marginTop: theme.spacing(2)
        }
    })
);

const Details = (props: IProps) => {
    const contactId = getRouteParam(props, 'caseId')
    const classes = useStyles()
    const [data, setData] = useState<IWorkflow | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setData(fakeCase())
        }, 500)
    }, [contactId])
    const hasError = !loading && !data

    return (
        <Navigation>
            {loading && <Loading/>}
            {hasError && <Error text='Failed load case data'/>}
            {
                data &&
                <Paper className={classes.root}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant='h4'>Case #{trimCaseId(data.id)}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                            <IBox title={
                                <Flex>
                                    <span>Case Status:</span>&nbsp;
                                    {printWorkflowStatus(data.status)}&nbsp;
                                    {printWorkflowSubStatus(data.subStatus)}&nbsp;
                                </Flex>
                            }>
                                <Typography>Case Body Here</Typography>
                            </IBox>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <IBox title='Case Summary'>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Typography>Summary here</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography>Summary here</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography>Summary here</Typography>
                                    </Grid>
                                </Grid>
                            </IBox>
                        </Grid>
                    </Grid>
                </Paper>
            }
        </Navigation>
    );
}

export default withRouter(Details);
