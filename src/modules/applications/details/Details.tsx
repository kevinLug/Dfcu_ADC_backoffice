import React, {useEffect, useState} from 'react';
import {RouteComponentProps, withRouter} from "react-router";
import Navigation from "../../../components/Navigation";
import {getRouteParam} from "../../../utils/routHelpers";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import {createStyles, Grid, makeStyles, Theme} from "@material-ui/core";

import {IWorkflow, trimCaseId} from "../types";
import Typography from "@material-ui/core/Typography";
import IBox from "../../../components/ibox/IBox";
import {Flex} from "../../../components/widgets";
import {printWorkflowStatus, printWorkflowSubStatus} from "../widgets";
import Summary from "./Summary";
import WorkflowView from "./WorkflowView";
import {get, put} from "../../../utils/ajax";
import {remoteRoutes} from "../../../data/constants";
import Button from "@material-ui/core/Button";
import LoaderDialog from "../../../components/LoaderDialog";


interface IProps extends RouteComponentProps {

}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            borderRadius: 0,
            padding: theme.spacing(1),
            minHeight: '100%'
        },
        divider: {
            marginTop: theme.spacing(2)
        },
        noPaddingLeft: {
            paddingLeft: 0
        }
    })
);

const Details = (props: IProps) => {
    const caseId = getRouteParam(props, 'caseId')
    const classes = useStyles()
    const [data, setData] = useState<IWorkflow | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [blocker, setBlocker] = useState<boolean>(false)
    const url = `${remoteRoutes.workflows}/${caseId}`

    useEffect(() => {
        get(
            url,
            resp => setData(resp),
            undefined,
            () => setLoading(false)
        )
    }, [caseId, url])

    function loadData() {
        setLoading(true)
        get(
            url,
            resp => setData(resp),
            undefined,
            () => setLoading(false)
        )
    }

    function onResume() {
        setBlocker(true)
        put(url, {}, resp => {
                console.log("Response", resp)
                loadData()
            },
            undefined,
            () => {
                setBlocker(false)
            })
    }

    if (loading)
        return <Navigation>
            <Loading/>
        </Navigation>

    const hasError = !loading && !data
    if (hasError)
        return <Navigation>
            <Error text='Failed load case data'/>
        </Navigation>

    const caseData = data as IWorkflow
    return (
        <Navigation>
            <div className={classes.root}>
                <LoaderDialog open={blocker} onClose={() => setBlocker(false)}/>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Flex>
                            <Typography variant='h3'>
                                Case #{trimCaseId(caseData.id)}
                            </Typography>
                            <div style={{marginTop: 4}}>&nbsp;&nbsp;{printWorkflowStatus(caseData.status)}</div>
                            <div style={{marginTop: 4}}>&nbsp;&nbsp;{printWorkflowSubStatus(caseData.subStatus)}</div>
                        </Flex>

                    </Grid>
                    <Grid item xs={12} sm={9}>
                        <IBox
                            title='Details'
                            action={<Button size='small' variant="contained" color='primary' onClick={onResume}>Resume
                                Case</Button>}
                        >
                            <WorkflowView data={caseData}/>
                        </IBox>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <IBox
                            title='Case Summary'
                        >
                            <Summary data={caseData}/>
                        </IBox>
                    </Grid>
                </Grid>
            </div>
        </Navigation>
    );
}

export default withRouter(Details);
