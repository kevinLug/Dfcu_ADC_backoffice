import React, {useEffect, useState} from 'react';
import {RouteComponentProps, withRouter} from "react-router";
import Navigation from "../../../components/Layout";
import {getRouteParam} from "../../../utils/routHelpers";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import {createStyles, Grid, makeStyles, Theme} from "@material-ui/core";

import {IWorkflow, trimCaseId, WorkflowStatus} from "../types";
import Typography from "@material-ui/core/Typography";
import {Flex} from "../../../components/widgets";

import LoaderDialog from "../../../components/LoaderDialog";
import {Dispatch} from "redux";
import {useDispatch, useSelector} from "react-redux";
import {fetchWorkflowAsync, IWorkflowState, startWorkflowFetch} from "../../../data/redux/workflows/reducer";

import {renderStatus, renderSubStatus} from "../widgets";

import BmVerificationRtgs from "../../scan/validate-verify/bm-verification-rtgs";
import {IState} from "../../../data/types";
import {printStdDatetime} from "../../../utils/dateHelpers";

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
    const user = useSelector((state: IState) => state.core.user)

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


    // @ts-ignore
    // const timestamp = workflow.tasks[1].actions[0].outputData["timestamp"]

    function submittedOrRejectedByCSO() {
        let returned = {}
        // @ts-ignore
        const outputDataCSO = workflow.tasks[1].actions[0].outputData

        if (outputDataCSO !== null && outputDataCSO !== undefined) {
            console.log('outputDataCSO: ', outputDataCSO)

            const submittedByCSO = JSON.parse(outputDataCSO)["submittedBy"]

            console.log('submittedByCSO: ', submittedByCSO)

            const runDateCSO = new Date(JSON.parse(outputDataCSO)["runDate"])
            console.log('runDateCSO: ', runDateCSO)
            // @ts-ignore
            console.log("the tasks: ", workflow["tasks"])

            // @ts-ignore
            const isRejectedByCSO: boolean = workflow.tasks[1].actions[0].outputData["isRejected"]

            if (caseData.status === WorkflowStatus.Error) {

                returned = <div style={styleUserAndDate}>&nbsp;&nbsp;Rejected by:
                    <span style={styleUserName}>{submittedByCSO}</span>{" - "}
                    <span style={styleUserName}>{printStdDatetime(runDateCSO)}</span>
                </div>
                // returned = <span style={styleUserName}>{caseData["caseData"]["user"]["name"]}</span>
            } else {
                returned = <div style={styleUserAndDate}>&nbsp;&nbsp;Submitted by:
                    <span style={styleUserName}>{submittedByCSO}</span>{" - "}
                    <span style={styleUserName}>{printStdDatetime(runDateCSO)}</span>
                </div>

            }
        } else {
            returned = ""
        }


        return returned;
    }

    function submittedOrRejectedByBM() {


        let returned = {}

        // @ts-ignore
        const outputDataBM = workflow.tasks[2].actions[0].outputData

        if (outputDataBM !== null && outputDataBM !== undefined) {


            const runDateCSO = new Date(JSON.parse(outputDataBM)["runDate"])


            // if (true) {

            const approvedByBM = JSON.parse(outputDataBM)["approvedBy"]
            const runDateBM = new Date(JSON.parse(outputDataBM)["runDate"])

            console.log('runDateCSO: ', runDateCSO)
            // @ts-ignore
            console.log("the tasks: ", workflow["tasks"])

            // @ts-ignore
            const isRejectedByCSO: boolean = workflow.tasks[1].actions[0].outputData["isRejected"]

            if (caseData.status === WorkflowStatus.Error) {

                returned = <div style={styleUserAndDate}>&nbsp;&nbsp; | Rejected by:
                    <span style={styleUserName}>{approvedByBM}</span>{" - "}
                    <span style={styleUserName}>{printStdDatetime(runDateBM)}</span>
                </div>
                // returned = <span style={styleUserName}>{caseData["caseData"]["user"]["name"]}</span>
            } else {
                returned = <div style={styleUserAndDate}>&nbsp;&nbsp;| Approved by:
                    <span style={styleUserName}>{approvedByBM}</span>{" - "}
                    <span style={styleUserName}>{printStdDatetime(runDateBM)}</span>
                </div>

            }
            // }

        } else {
            returned = ""
        }


        return returned;
    }

    function submittedOrRejectedByCMO() {


        let returned = {}

        // @ts-ignore
        const outputDataCMO = workflow.tasks[3].actions[0].outputData

        console.log("walked:",outputDataCMO)

        if (outputDataCMO !== null && outputDataCMO !== undefined) {

            // const runDateCMO = new Date(JSON.parse(outputDataCMO)["runDate"])

            // if (true) {

            // todo...include rejected by as well
            const clearedByCMO = JSON.parse(outputDataCMO)["session"]["username"]
            const runDateCMO = new Date(JSON.parse(outputDataCMO)["runDate"])

            console.log('runDateCSO: ', runDateCMO)
            // @ts-ignore
            console.log("the tasks: ", workflow["tasks"])

            // @ts-ignore
            const isRejectedByCMO: boolean = workflow.tasks[3].actions[0].outputData["isRejected"]

            if (caseData.status === WorkflowStatus.Error) {

                returned = <div style={styleUserAndDate}>&nbsp;&nbsp; | Rejected by:
                    <span style={styleUserName}>{clearedByCMO}</span>{" - "}
                    <span style={styleUserName}>{printStdDatetime(runDateCMO)}</span>
                </div>
                // returned = <span style={styleUserName}>{caseData["caseData"]["user"]["name"]}</span>
            } else {
                returned = <div style={styleUserAndDate}>&nbsp;&nbsp;| Cleared By:
                    <span style={styleUserName}>{clearedByCMO}</span>{" - "}
                    <span style={styleUserName}>{printStdDatetime(runDateCMO)}</span>
                </div>

            }
            // }

        } else {
            returned = ""
        }


        return returned;
    }

    const styleUserAndDate = {
        marginTop: 4,
        fontWeight: 10
    };

    const styleUserName = {
        fontSize: 14,
        fontWeight: 450
    };

    function displayWorkflowStatus(){

        if (caseData.status === WorkflowStatus.Open){
            return renderStatus(WorkflowStatus.New)
        }

        if (caseData.status === WorkflowStatus.Error){
            return renderStatus(WorkflowStatus.Rejected)
        }

        if (caseData.status === WorkflowStatus.Closed){
            return renderStatus(WorkflowStatus.Cleared)
        }

        return renderStatus(caseData.status)
    }

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
                            <div
                                // style={{marginTop: 4}}>&nbsp;&nbsp;{caseData.status === WorkflowStatus.Open ? renderStatus(WorkflowStatus.New) : renderStatus(caseData.status)}</div>
                                style={{marginTop: 4}}>&nbsp;&nbsp;{displayWorkflowStatus()}</div>
                            <div style={{marginTop: 4}}>&nbsp;&nbsp;{renderSubStatus(caseData.subStatus)}</div>
                            {
                                submittedOrRejectedByCSO()
                            }

                            {
                                submittedOrRejectedByBM()
                            }

                            {
                                submittedOrRejectedByCMO()
                            }

                            {/*<div style={{marginTop: 4}}>&nbsp;&nbsp;Submitted by: {user.name} {" "} {printStdDatetime(caseData.applicationDate)}</div>*/}
                        </Flex>
                    </Grid>
                    <BmVerificationRtgs workflow={caseData}/>
                </Grid>
            </div>
        </Navigation>
    );
}

export default withRouter(Details);
