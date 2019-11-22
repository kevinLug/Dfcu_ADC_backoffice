import React, {useEffect, useState} from 'react';
import {RouteComponentProps, withRouter} from "react-router";
import Navigation from "../../../components/Layout";
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
import {put} from "../../../utils/ajax";
import {remoteRoutes} from "../../../data/constants";
import Button from "@material-ui/core/Button";
import LoaderDialog from "../../../components/LoaderDialog";
import {Dispatch} from "redux";
import {useDispatch, useSelector} from "react-redux";
import {fetchWorkflowAsync, IWorkflowState, startWorkflowFetch} from "../../../data/workflows/reducer";


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
    const [blocker, setBlocker] = useState<boolean>(false)
    const {loading, workflow}: IWorkflowState = useSelector((state: any) => state.workflows)
    const dispatch: Dispatch<any> = useDispatch();


    useEffect(() => {
        dispatch(startWorkflowFetch())
        dispatch(fetchWorkflowAsync(caseId))
    }, [caseId])

    function loadData() {
        dispatch(startWorkflowFetch())
        dispatch(fetchWorkflowAsync(caseId))
    }

    function onResume() {
        const url = `${remoteRoutes.workflows}/${caseId}`
        setBlocker(true)
        put(url, {},
            resp => loadData(),
            undefined,
            () => {
                setBlocker(false)
            })
    }

    if (loading)
        return <Navigation>
            <Loading/>
        </Navigation>

    const hasError = !loading && !workflow
    if (hasError)
        return <Navigation>
            <Error text='Failed load case data'/>
        </Navigation>

    const caseData = workflow as IWorkflow
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
