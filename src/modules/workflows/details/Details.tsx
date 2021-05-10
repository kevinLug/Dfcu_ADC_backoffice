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

import LoaderDialog from "../../../components/LoaderDialog";
import {Dispatch} from "redux";
import {useDispatch, useSelector} from "react-redux";
import {fetchWorkflowAsync, IWorkflowState, startWorkflowFetch} from "../../../data/redux/workflows/reducer";

import {renderStatus, renderSubStatus} from "../widgets";

import BmVerificationRtgs from "../../scan/validate-verify/bm-verification-rtgs";

interface IProps extends RouteComponentProps {

}

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
    const classes = useStyles()
    const [blocker, setBlocker] = useState<boolean>(false)
    const {loading, workflow}: IWorkflowState = useSelector((state: any) => state.workflows)

    const dispatch: Dispatch<any> = useDispatch();
    useEffect(() => {
        dispatch(startWorkflowFetch())
        dispatch(fetchWorkflowAsync(caseId))
        // console.log(`workflow fetched:`, workflow)
// @ts-ignore
//         if (workflow.tasks) {
// @ts-ignore
//             console.log(`pinnacle:`, workflow.tasks)

        // }
    }, [caseId, dispatch])

    if (loading)
        return <Navigation>
            <Loading/>
        </Navigation>

    const hasError = !loading && !workflow
    if (hasError) {
        console.log('workflow erred', workflow)
        return <Navigation>
            <Error text='Failed load case data'/>
        </Navigation>
    }

    const caseData = workflow as IWorkflow;

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
                            <div style={{marginTop: 4}}>&nbsp;&nbsp;{renderStatus(caseData.status)}</div>
                            <div style={{marginTop: 4}}>&nbsp;&nbsp;{renderSubStatus(caseData.subStatus)}</div>
                        </Flex>
                    </Grid>
                    <BmVerificationRtgs workflow={caseData}/>
                </Grid>
            </div>
        </Navigation>
    );
}

export default withRouter(Details);
