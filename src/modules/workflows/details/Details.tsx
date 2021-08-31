import React, {useEffect, useState} from 'react';
import {RouteComponentProps, withRouter} from "react-router";
import Navigation from "../../../components/Layout";
import {getRouteParam} from "../../../utils/routHelpers";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import {createStyles, Grid, makeStyles, Theme} from "@material-ui/core";

import {IWorkflow, trimCaseId, WorkflowStatus, WorkflowSubStatus} from "../types";
import Typography from "@material-ui/core/Typography";
import {Flex} from "../../../components/widgets";

import LoaderDialog from "../../../components/LoaderDialog";
import {Dispatch} from "redux";
import {useDispatch, useSelector} from "react-redux";
import {fetchWorkflowAsync, IWorkflowState, startWorkflowFetch} from "../../../data/redux/workflows/reducer";

import {renderStatus} from "../widgets";

import AllValidations from "../../scan/validate-verify/AllValidations";

import {printDateTime} from "../../../utils/dateHelpers";
import {ConstantLabelsAndValues} from "../../../data/constants";

import {isNullOrEmpty, isNullOrUndefined} from "../../../utils/objectHelpers";
import {IForexValueState} from "../../../data/redux/forex/reducer";

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
    const {forexValue}: IForexValueState = useSelector((state: any) => state.forexDetails)

    const dispatch: Dispatch<any> = useDispatch();
    useEffect(() => {
        dispatch(startWorkflowFetch())
        dispatch(fetchWorkflowAsync(caseId))
    }, [caseId, dispatch, forexValue])

    if (loading)
        return <Navigation>
            <Loading/>
        </Navigation>

    const hasError = !loading && !workflow
    if (hasError) {
        return <Navigation>
            <Error text='Failed load case data'/>
        </Navigation>
    }

    const caseData = workflow as IWorkflow;

    function submittedOrRejectedByCSO() {
        let returned: any
        // @ts-ignore
        const outputDataCSO = workflow.tasks[1].actions[0].outputData
        // @ts-ignore
        const actionRunDate = workflow.tasks[1].actions[0].runDate

        if (!isNullOrUndefined(outputDataCSO)) {
            const parsedOutputDataCSO = JSON.parse(outputDataCSO)

            const submittedByCSO = parsedOutputDataCSO["submittedBy"]

            let rejectionComment: string

            // @ts-ignore
            if (!isNullOrEmpty(parsedOutputDataCSO['rejectionComment']) && !isNullOrUndefined(parsedOutputDataCSO['rejectionComment'])) {

                rejectionComment = parsedOutputDataCSO['rejectionComment']
            } else {

                // @ts-ignore
                rejectionComment = workflow.tasks[1].actions[0].statusMessage

            }

            if (caseData.subStatus === WorkflowSubStatus.FailedCSOApproval) {

                returned = <div style={styleUserAndDate}>&nbsp;&nbsp;{ConstantLabelsAndValues.REJECTED_BY}
                    <span style={styleUserName}>{submittedByCSO}</span>{" - "}
                    <span style={styleUserName}>{printDateTime(actionRunDate)}</span>
                    <br/>&nbsp;&nbsp;{ConstantLabelsAndValues.REASON_FOR_REJECTION}
                    <span style={styleUserName}>{rejectionComment}</span>
                </div>

            } else {
                returned = <div style={styleUserAndDate}>&nbsp;&nbsp;{ConstantLabelsAndValues.SUBMITTED_BY}
                    <span style={styleUserName}>{submittedByCSO}</span>{" - "}
                    <span style={styleUserName}>{printDateTime(actionRunDate)}</span>
                </div>

            }
        } else {
            returned = ""
        }

        return returned;
    }

    function submittedOrRejectedByBM() {

        let returned: {}

        // @ts-ignore
        const outputDataBM = workflow.tasks[2].actions[0].outputData
        // @ts-ignore
        const actionRunDate = workflow.tasks[2].actions[0].runDate
        // @ts-ignore
        const parsedOutputDataBM = JSON.parse(workflow.tasks[2].actions[0].outputData)

        if (outputDataBM !== null && outputDataBM !== undefined) {

            const approvedByBM = JSON.parse(outputDataBM)["approvedBy"]

            let rejectionComment: string

            if (!isNullOrUndefined(parsedOutputDataBM['rejectionComment']) && !isNullOrEmpty(parsedOutputDataBM['rejectionComment'])) {

                rejectionComment = parsedOutputDataBM['rejectionComment']
            } else {
                // @ts-ignore
                rejectionComment = workflow.tasks[2].actions[0].statusMessage
            }

            if (caseData.subStatus === WorkflowSubStatus.FailedBMApproval) {

                returned = <div style={styleUserAndDate}>&nbsp;&nbsp;{ConstantLabelsAndValues.REJECTED_BY}
                    <span style={styleUserName}>{approvedByBM}</span>{" - "}
                    <span style={styleUserName}>{printDateTime(actionRunDate)}</span>
                    <br/>&nbsp;&nbsp;{ConstantLabelsAndValues.REASON_FOR_REJECTION}
                    <span style={styleUserName}>{rejectionComment}</span>
                </div>

            } else {

                returned = <div style={styleUserAndDate}>&nbsp;&nbsp;{ConstantLabelsAndValues.APPROVED_BY}
                    <span style={styleUserName}>{approvedByBM}</span>{" - "}
                    <span style={styleUserName}>{printDateTime(actionRunDate)}</span>
                </div>

            }

        } else {
            returned = ""
        }

        return returned;
    }

    function submittedOrRejectedByCMO() {

        let returned: {}

        // @ts-ignore


        // first consider a rejection from the CMO

        let rejectionComment = ''
        // @ts-ignore
        if (workflow.subStatus === WorkflowSubStatus.SendingToFinacleFailed) {
            // @ts-ignore
            const inputDataCMO = workflow.tasks[3].actions[0].outputData

            rejectionComment = JSON.parse(inputDataCMO)['rejectionComment']
        }

        // @ts-ignore
        const outputDataCMO = workflow.tasks[3].actions[1].inputData
        // @ts-ignore
        const runDate = workflow.tasks[3].actions[1].runDate

        if (outputDataCMO !== null && outputDataCMO !== undefined) {

            // todo...include rejected by as well
            const clearedByCMO = JSON.parse(outputDataCMO)["session"]["username"]

            const runDateCMO = printDateTime(runDate)

            if (caseData.status === WorkflowStatus.Error) {

                // @ts-ignore
                returned = <div style={styleUserAndDate}>&nbsp;&nbsp;{ConstantLabelsAndValues.REJECTED_BY}
                    <span style={styleUserName}>{clearedByCMO}</span>{" - "}
                    <span style={styleUserName}>{runDateCMO}</span>
                    <br/>&nbsp;&nbsp;{ConstantLabelsAndValues.REASON_FOR_REJECTION}
                    <span style={styleUserName}>{rejectionComment}</span>
                </div>

            } else {

                returned = <div style={styleUserAndDate}>&nbsp;&nbsp;{ConstantLabelsAndValues.CLEARED_BY}
                    <span style={styleUserName}>{clearedByCMO}</span>{" - "}
                    <span style={styleUserName}>{runDateCMO}</span>
                </div>

            }

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

    function displayWorkflowStatus() {

        if (caseData.status === WorkflowStatus.Open && caseData.subStatus === WorkflowSubStatus.AwaitingCSOApproval) {
            return renderStatus(WorkflowStatus.New)
        }
        // awaiting BOM approval
        if (caseData.status === WorkflowStatus.Open && caseData.subStatus === WorkflowSubStatus.AwaitingBMApproval) {
            return renderStatus(WorkflowStatus.Pending)
        }
        // awaiting CMO clearance
        if (caseData.status === WorkflowStatus.Open && caseData.subStatus === WorkflowSubStatus.AwaitingSubmissionToFinacle) {
            return renderStatus(WorkflowStatus.PendingClearance)
        }

        if (caseData.status === WorkflowStatus.Error) {
            return renderStatus(WorkflowStatus.Rejected)
        }

        if (caseData.status === WorkflowStatus.Closed) {
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

                                style={{marginTop: 4}}>&nbsp;&nbsp;{displayWorkflowStatus()}</div>

                        </Flex>

                        {
                            submittedOrRejectedByCSO()
                        }

                        {
                            submittedOrRejectedByBM()
                        }

                        {
                            submittedOrRejectedByCMO()
                        }

                    </Grid>
                    <AllValidations workflow={caseData}/>
                </Grid>
            </div>
        </Navigation>
    );
}

export default withRouter(Details);
