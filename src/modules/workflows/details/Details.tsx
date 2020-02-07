import React, {useEffect, useState} from 'react';
import {RouteComponentProps, withRouter} from "react-router";
import Navigation from "../../../components/Layout";
import {getRouteParam} from "../../../utils/routHelpers";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import {createStyles, Grid, makeStyles, Theme} from "@material-ui/core";

import {IWorkflow, trimCaseId} from "../types";
import Typography from "@material-ui/core/Typography";
import {Flex} from "../../../components/widgets";
import Summary from "./Summary";
import WorkflowView from "./WorkflowView";
import {put} from "../../../utils/ajax";
import {remoteRoutes} from "../../../data/constants";
import Button from "@material-ui/core/Button";
import LoaderDialog from "../../../components/LoaderDialog";
import {Dispatch} from "redux";
import {useDispatch, useSelector} from "react-redux";
import {fetchWorkflowAsync, IWorkflowState, startWorkflowFetch} from "../../../data/redux/workflows/reducer";
import {successColor} from "../../../theme/custom-colors";
import {renderStatus, renderSubStatus} from "../widgets";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";


interface IProps extends RouteComponentProps {

}

const useWfStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: 0,
            backgroundColor: 'transparent'
        },
        stepPaper: {
            borderRadius: 0,
        },
        stepLabel: {
            padding: theme.spacing(1)
        },
        stepContent: {
            paddingRight: 0,
            paddingBottom: theme.spacing(1)

        },
        taskIcon: {
            marginTop: 1
        },
        successIcon: {
            color: successColor
        }
    })
);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            borderRadius: 0,
            padding: theme.spacing(1),
            height: '100%',
            overflow: 'auto'
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
    const wfClasses = useWfStyles()
    const classes = useStyles()
    const [blocker, setBlocker] = useState<boolean>(false)
    const {loading, workflow}: IWorkflowState = useSelector((state: any) => state.workflows)
    const dispatch: Dispatch<any> = useDispatch();

    function loadData() {
        dispatch(startWorkflowFetch())
        dispatch(fetchWorkflowAsync(caseId))
    }

    useEffect(() => {
        loadData()
    }, [caseId,dispatch])

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
            <div className={classes.root} >
                <LoaderDialog open={blocker} onClose={() => setBlocker(false)}/>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Flex>
                            <Typography variant='h3'>
                                Case #{trimCaseId(caseData.id)}
                            </Typography>
                            <div style={{marginTop: 4}}>&nbsp;&nbsp;{renderStatus(caseData.status)}</div>
                            <div style={{marginTop: 4}}>&nbsp;&nbsp;{renderSubStatus(caseData.subStatus)}</div>
                        </Flex>

                    </Grid>
                    <Grid item xs={12} sm={9}>
                        <Box display='flex' py={1}>
                            <Box flexGrow={1} pt={1}>
                                <Typography variant='h5'>Details</Typography>
                            </Box>
                            <Box>
                                <Button size='small' variant="outlined" color='primary' onClick={onResume}>
                                    Preview Docs
                                </Button>
                                &nbsp;
                                <Button size='small' variant="outlined" color='primary' onClick={onResume}>
                                    Resume Case
                                </Button>
                            </Box>
                        </Box>
                        <Divider/>
                        <Box pt={1}>
                            <WorkflowView data={caseData} classes={wfClasses} />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Box display='flex' py={1}>
                            <Box flexGrow={1} pt={1}>
                                <Typography variant='h5'>Summary</Typography>
                            </Box>
                        </Box>
                        <Divider/>
                        <Box pt={1}>
                            <Summary data={caseData} />
                        </Box>
                    </Grid>
                </Grid>
            </div>
        </Navigation>
    );
}

export default withRouter(Details);
