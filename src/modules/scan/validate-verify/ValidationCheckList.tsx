import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {addCheck, IPropsChecks} from "./Check";
import CheckBoxTemplate from "./Check";
import {IList, List} from "../../../utils/collections/list";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import {createStyles, makeStyles, TextareaAutosize} from "@material-ui/core";
import {IWorkflowResponseMessageState} from "../../../data/redux/workflow-response/reducer";
import {useDispatch, useSelector} from "react-redux";

import {ICheckKeyValueState} from "../../../data/redux/checks/reducer";

import {IManualDecision, WorkflowSubStatus} from "../../workflows/types";

// import {csoOrBmRolesForDev, hasAnyRole, remoteRoutes, systemRoles} from "../../../data/constants";
import {hasAnyRole, remoteRoutes, systemRoles} from "../../../data/constants";

import {post} from "../../../utils/ajax";
import {getChecksToPopulate} from "../populateLabelAndValue";
import {IWorkflowState} from "../../../data/redux/workflows/reducer";
import {Dispatch} from "redux";
import EditDialog from "../../../components/EditDialog";
import {Form, Formik, Field, FormikHelpers} from 'formik';
import {IKeyValueMap} from "../../../utils/collections/map";
import {IState} from "../../../data/types";
import VerificationsAlreadyDoneByCSO from "./checks-already-done-by-cso";
import Toast from "../../../utils/Toast";

const useStyles = makeStyles(() =>
    createStyles({
        submissionGrid: {
            marginTop: 35
        },
        submissionBox: {
            display: 'flex',
            justifyContent: 'space-between'
        },
        rejectButton: {
            backgroundColor: '#b32121',
            color: 'white'
        }

    })
);

interface IProps {
    theCheckList: IList<IPropsChecks>;
    caseId?: any
}

export interface IDataProps {
    checks: {};
    rejectionComment: string;
}

export const checkListCSO = (): IList<IPropsChecks> => {

    const theCheckList = new List<IPropsChecks>();
    theCheckList.add(addCheck("Transfer request is signed as per account mandate", "isTransferSignedAsPerAccountMandate"))
    theCheckList.add(addCheck("Transfer requires forex", "transferRequiresForex"))
    theCheckList.add(addCheck("Sender's account number is correct", "isSenderAccountNumberCorrect"))
    theCheckList.add(addCheck("Sender has sufficient funds", "senderHasSufficientFunds"))
    theCheckList.add(addCheck("Recipient's bank details are complete", "isRecipientBankDetailsComplete"))
    theCheckList.add(addCheck("Recipient's physical address is complete (TTs)", "isRecipientPhysicalAddressComplete"))

    return theCheckList;
}

const ValidationCheckList = ({theCheckList}: IProps) => {

    const classes = useStyles()
    const {workflowResponseMessage}: IWorkflowResponseMessageState = useSelector((state: any) => state.workflowResponse)

    const {check}: ICheckKeyValueState = useSelector((state: any) => state.checks)
    const {workflow}: IWorkflowState = useSelector((state: any) => state.workflows)
    const user = useSelector((state: IState) => state.core.user)

    const dispatch: Dispatch<any> = useDispatch();

    const [showCommentBox, setShowCommentBox] = useState(false)
    const [isRejectBtnDisabled, setRejectBtnDisabled] = useState(false)

    const [rejectionComment, setRejectionComment] = useState('')
    const [subStatusFound, setSubStatusFound] = useState('')
    const initialData: IDataProps = {
        checks: check.checks,
        rejectionComment: rejectionComment
    }

    const [data, setData] = useState(initialData)

    useEffect(() => {
        // console.log(check.checks)
        // setData({checks: getChecksToPopulate(check.checks), rejectionComment: rejectionComment})

        // @ts-ignore
        // setSubStatusFound(workflow.subStatus)

    }, [dispatch, check, workflow, rejectionComment, data])

    const handleCSOApproval = async () => {

        let data = getChecksToPopulate(check.checks);


        let caseId: string
        if (!workflowResponseMessage.caseId || workflowResponseMessage.caseId.includes("0000-0000")) {
            // @ts-ignore
            caseId = workflow.id
        } else {
            caseId = workflowResponseMessage.caseId
        }

        // @ts-ignore
        data["isRejected"] = false;
        // @ts-ignore
        data["submittedBy"] = user.name
        // @ts-ignore
        data["timestamp"] = new Date()
        const manualCSOApproval: IManualDecision = {
            caseId: caseId,
            taskName: "cso-approval", // todo ...consider making these constants
            actionName: "cso-transfer-details-approval",
            resumeCase: true,
            nextSubStatus: "SenderDetailsCheckSuccessful",
            data: data,
            override: false
        }

        post(remoteRoutes.workflowsManual, manualCSOApproval, (resp: any) => {
                console.log(resp) // todo ... consider providing a message for both success and failure
            }, undefined,
            () => {
                window.location.href = window.location.origin
            }
        )
    }

    const handleCSORejection = async () => {

        let checks = getChecksToPopulate(check.checks);

        const obj = {
            checks: checks,
            rejectionComment: rejectionComment
        }

        setData({checks, rejectionComment})

        // @ts-ignore
        checks["rejectionComment"] = obj.rejectionComment;
        // @ts-ignore
        checks["isRejected"] = true;
        // @ts-ignore
        checks["submittedBy"] = user.name

        let caseId: string
        if (!workflowResponseMessage.caseId || workflowResponseMessage.caseId.includes("0000-0000")) {
            // @ts-ignore
            caseId = workflow.id
        } else {
            caseId = workflowResponseMessage.caseId
        }

        const manualCSORejection: IManualDecision = {
            caseId: caseId,
            taskName: "cso-approval", // todo ...consider making these constants
            actionName: "cso-transfer-details-approval",
            resumeCase: true,
            nextSubStatus: "SenderDetailsCheckSuccessful",
            data: {...checks, rejectionComment: obj.rejectionComment},
            override: false
        }

        if (manualCSORejection.data.rejectionComment.trim().length === 0) {
            Toast.warn("Please provide a rejection comment...");
            return;
        }

        if (manualCSORejection.data.rejectionComment.trim().length > 0) {
            console.log("manual-cso-rejection:", manualCSORejection);

            // todo...uncomment
            post(remoteRoutes.workflowsManual, manualCSORejection, (resp: any) => {
                    console.log(resp) // todo ... consider providing a message for both success and failure
                }, undefined,
                () => {
                    window.location.href = window.location.origin
                }
            )

            setShowCommentBox(false)

        } else {
            Toast.warn("Please provide a rejection comment");
        }


    }

    function showCommentDialog() {
        setShowCommentBox(true)
    }

    function cancelCommentDialog() {
        setShowCommentBox(false)
    }

    function setComment(e: any) {
        setRejectionComment(e.target.value)
    }

    function showChecksFormOrChecksResults() {
        // console.log("loggin...:", workflow)
        let returned = {}
        // @ts-ignore
        if (workflow !== undefined && workflow !== null && (workflow.subStatus.includes("BM") || workflow.subStatus.includes("Fail"))) {
            // @ts-ignore
            returned = <VerificationsAlreadyDoneByCSO workflow={workflow}/>
        } else {
            returned = theCheckList.toArray().map((aCheck, index) => {
                return <Grid key={index} item sm={12}>
                    <CheckBoxTemplate value={aCheck.value} label={aCheck.label} name={aCheck.name}/>
                </Grid>
            })
        }
        return returned

    }

    return (

        <Grid container>
            {
                showChecksFormOrChecksResults()
                // theCheckList.toArray().map((aCheck, index) => {
                //     // console.log("found: ", subStatusFound)
                //
                //     return <Grid key={index} item sm={12}>
                //         <CheckBoxTemplate value={aCheck.value} label={aCheck.label} name={aCheck.name}/>
                //     </Grid>
                // })
            }

            <Grid item sm={12} className={classes.submissionGrid}>

                {
                    hasAnyRole(user, [systemRoles.CSO]) ?
                        <Box className={classes.submissionBox}>
                            <Button variant="contained" className={classes.rejectButton}
                                    onClick={showCommentDialog}>REJECT</Button>
                            <Button variant="contained" color="primary" onClick={handleCSOApproval}>SUBMIT
                                REQUEST</Button>
                        </Box>
                        :
                        ""
                }

            </Grid>

            {
                showCommentBox ? <EditDialog open={true} onClose={() => {
                    }} title="Reject with a reason (comment)" disableBackdropClick={false}>
                        <Grid item sm={12}>

                            <Formik

                                enableReinitialize

                                initialValues={data}
                                onSubmit={async values => {
                                    await new Promise(resolve => {
                                        setTimeout(resolve, 500)
                                        // console.log("sub value: ", values)
                                        handleCSORejection()
                                        // alert(`ale-2${JSON.stringify(data, null, 2)}:`);
                                    });

                                }}
                            >
                                <Form>
                                    <TextareaAutosize
                                        // rowsMax={}
                                        rowsMin={10}
                                        cols={40}
                                        aria-label="maximum height"
                                        placeholder="write comment here..."
                                        onChange={setComment}


                                    />

                                    <Grid item sm={12} className={classes.submissionGrid}>
                                        <Box className={classes.submissionBox}>
                                            <Button variant="contained" className={classes.rejectButton}
                                                    onClick={cancelCommentDialog}>Cancel</Button>
                                            <Button type="submit" variant="contained" color="primary"
                                                    disabled={isRejectBtnDisabled}
                                                    onSubmit={handleCSORejection}>Confirm</Button>
                                        </Box>
                                    </Grid>
                                </Form>
                            </Formik>

                        </Grid>
                    </EditDialog>
                    :
                    ""
            }

        </Grid>

    )
}

export default ValidationCheckList