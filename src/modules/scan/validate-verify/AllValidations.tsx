import Grid from "@material-ui/core/Grid";
import ExpansionCard from "../../../components/ExpansionCard";
import SenderDetails from "./SenderDetails";
import BeneficiaryDetails from "./BeneficiaryDetails";
import TransferDetails from "./TransferDetails";

import React, {useEffect, useState} from "react";
import {IWorkflow, WorkflowSubStatus} from "../../workflows/types";
import {ICase, ICaseData} from "../../transfers/types";
// import {IList} from "../../../utils/collections/list";
// import {IPropsChecks} from "./Check";
import {actionICaseState} from "../../../data/redux/transfers/reducer";
import {Dispatch} from "redux";
import {useDispatch, useSelector} from "react-redux";
import {useStyles} from "../ScanCrop";
import {IState} from "../../../data/types";
import CsoValidationChecklist from "./CsoValidationChecklist";
import ImageUtils from "../../../utils/imageUtils";
// import {csoOrBmRolesForDev, remoteRoutes} from "../../../data/constants";
import {ConstantLabelsAndValues, hasAnyRole, systemRoles} from "../../../data/constants";
// import {createStyles, makeStyles} from "@material-ui/core";
import {ICheckKeyValueState} from "../../../data/redux/checks/reducer";
import VerificationsAlreadyDoneByCSO from "./ChecksAlreadyDoneByCso";
import VerificationsAlreadyDoneByBM from "./ChecksAlreadyDoneByBom";
import VerificationByBmo from "./VerificationByBmo";
import CmoFinacleSubmission from "./CmoFinacleSubmission";
import {IWorkflowResponseMessageState} from "../../../data/redux/workflow-response/reducer";
import Typography from "@material-ui/core/Typography";

import Divider from "@material-ui/core/Divider";

interface IProps {
    workflow: IWorkflow
}

const AllValidations = ({workflow}: IProps) => {

    const classes = useStyles();
    const [imageSrcFromBinary, setImageSrcFromBinary] = useState<string>("")
    const user = useSelector((state: IState) => state.core.user)
    const dispatch: Dispatch<any> = useDispatch();


    const {check}: ICheckKeyValueState = useSelector((state: any) => state.checks)

    const {workflowResponseMessage}: IWorkflowResponseMessageState = useSelector((state: any) => state.workflowResponse)

    useEffect(() => {

        const aCase: ICase = {
            applicationDate: workflow.applicationDate,
            externalReference: workflow.externalReference,
            referenceNumber: Number(workflow.referenceNumber),
            workflowType: workflow.type,
            caseData: workflow.caseData
        }

        dispatch(actionICaseState(aCase));

        const caseData: ICaseData = workflow.caseData

        // todo .. sprout/move this step (for re-usability)...also used in ScanCrop.tsx
        const arrayBuffer = ImageUtils.base64ToArrayBuffer(caseData.doc)
        // const arrayBuffer = new Buffer(caseData.doc)
        const blob = ImageUtils.arrayBufferToBlob(arrayBuffer)
        // const blob = new Blob([arrayBuffer])
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = (event: any) => {
            const base64 = event.target.result
            setImageSrcFromBinary(base64)
        };

    }, [dispatch, check, workflow])

    function displayVerificationsByCSO() {

        // still awaiting CSO approval
        if (workflow.subStatus === WorkflowSubStatus.AwaitingCSOApproval && hasAnyRole(user, [systemRoles.CSO]))
            return <Grid className={classes.expansion}>
                <Typography variant="h4">Validation Checklist</Typography>
                <CsoValidationChecklist theCheckList={ConstantLabelsAndValues.csoValidationCheckList()}/>
                {/*<ExpansionCard title="Verification  Checklist" children={<CsoValidationChecklist theCheckList={theCheckList}/>}/>*/}
            </Grid>

        // show verifications done by CSO if process awaits BM action, CMO action, or erred
        if ((workflow.subStatus.includes("BM") || workflow.subStatus.includes("Finacle") || workflow.subStatus.includes("Fail")) && hasAnyRole(user, [systemRoles.CSO])) {
            return <Grid className={classes.expansion}>
                <Typography variant="h4">Validation Checklist</Typography>
                <VerificationsAlreadyDoneByCSO workflow={workflow}/>
            </Grid>
        }

    }

    function displayVerificationsByBM() {

        if (workflow.subStatus === WorkflowSubStatus.FailedCSOApproval) {
            return <Grid className={classes.expansion}>

                {/*Validations already done by CSO*/}
                <Typography variant="h4">CSO - Validation Checklist</Typography>
                <VerificationsAlreadyDoneByCSO workflow={workflow}/>

            </Grid>
        }

        if (workflow.subStatus === WorkflowSubStatus.AwaitingBMApproval && hasAnyRole(user, [systemRoles.BM, systemRoles.BOM]))
            return <Grid className={classes.expansion}>

                {/*Validations already done by CSO*/}
                <Typography variant="h4">CSO - Validation Checklist</Typography>
                <VerificationsAlreadyDoneByCSO workflow={workflow}/>

                <Divider style={{padding:5}} light={true} orientation='horizontal' variant="middle"/>

                <Typography variant="h4">Validation Checklist</Typography>
                <VerificationByBmo workflow={workflow}/>
            </Grid>

        if ((workflow.subStatus.includes(WorkflowSubStatus.AwaitingSubmissionToFinacle) || workflow.subStatus.includes(WorkflowSubStatus.FailedBMApproval))
            && hasAnyRole(user, [systemRoles.BM, systemRoles.BOM]))
            return <Grid className={classes.expansion}>

                {/*Validations already done by CSO*/}
                <Typography variant="h4">CSO - Validation Checklist</Typography>
                <VerificationsAlreadyDoneByCSO workflow={workflow}/>

                <Typography variant="h4">Validation Checklist</Typography>
                <VerificationsAlreadyDoneByBM workflow={workflow}/>

            </Grid>
    }

    // function showVerificationsToBeDoneByBM() {
    //     // if (workflow.subStatus === WorkflowSubStatus.AwaitingSubmissionToFinacle && hasAnyRole(user, [systemRoles.BM, systemRoles.BMO])) {
    //     //     return <Grid className={classes.expansion}>
    //     //         <ExpansionCard title="Verification list - BMO" children={<VerificationsAlreadyDoneByBM workflow={workflow}/>}/>
    //     //     </Grid>
    //     // }
    // }

    function displaySubmissionToFinacle() {
        if (workflow.subStatus === WorkflowSubStatus.AwaitingSubmissionToFinacle && hasAnyRole(user, [systemRoles.CMO])) {
            return <Grid className={classes.expansion}>
                <Typography variant="h4">Submit to Finacle</Typography>
                <CmoFinacleSubmission user={user} workflowResponseMessage={workflowResponseMessage} workflow={workflow}/>
            </Grid>
        }
    }

    // function showChecksFormOrChecksResults() {
    //     // @ts-ignore
    //     console.log("loggin....:", workflow.subStatus)
    //     // @ts-ignore
    //     if (workflow.subStatus !== null) {
    //
    //
    //         // @ts-ignore
    //         if (workflow.subStatus.includes("BM") || workflow.subStatus.includes("Fail")) {
    //
    //             // @ts-ignore
    //             return <VerificationsAlreadyDoneByCSO workflow={workflow}/>
    //
    //         } else {
    //
    //             theCheckList.toArray().map((aCheck, index) => {
    //                 // console.log("found: ", subStatusFound)
    //
    //                 return <Grid key={index} item sm={12}>
    //                     <CheckBoxTemplate value={aCheck.value} label={aCheck.label} name={aCheck.name}/>
    //                 </Grid>
    //             })
    //
    //         }
    //
    //     }
    //
    // }
    //
    // function setComment(e: any) {
    //     setRejectionComment(e.target.value)
    // }
    //
    //
    // function cancelCommentDialog() {
    //     setShowCommentBox(false)
    // }
    //
    //
    // function handleBMORejection() {
    //     // let checks = getChecksToPopulate(check.checks);
    //     //
    //     // const obj = {
    //     //     checks: checks,
    //     //     rejectionComment: rejectionComment
    //     // }
    //     //
    //     // setData({checks, rejectionComment})
    //     //
    //     // // @ts-ignore
    //     // checks["rejectionComment"] = obj.rejectionComment;
    //     // // @ts-ignore
    //     // checks["isRejected"] = true;
    //     // // @ts-ignore
    //     // checks["submittedBy"] = user.name
    //     //
    //     // let caseId: string
    //     // if (!workflowResponseMessage.caseId || workflowResponseMessage.caseId.includes("0000-0000")) {
    //     //     // @ts-ignore
    //     //     caseId = workflow.id
    //     // } else {
    //     //     caseId = workflowResponseMessage.caseId
    //     // }
    //     //
    //     // const manualCSORejection: IManualDecision = {
    //     //     caseId: caseId,
    //     //     taskName: "cso-approval", // todo ...consider making these constants
    //     //     actionName: "cso-transfer-details-approval",
    //     //     resumeCase: true,
    //     //     nextSubStatus: "SenderDetailsCheckSuccessful",
    //     //     data: {...checks, rejectionComment: obj.rejectionComment},
    //     //     override: false
    //     // }
    //     //
    //     // if (manualCSORejection.data.rejectionComment.trim().length === 0) {
    //     //     Toast.warn("Please provide a rejection comment...");
    //     //     return;
    //     // }
    //     //
    //     // if (manualCSORejection.data.rejectionComment.trim().length > 0) {
    //     //     console.log("manual-cso-rejection:", manualCSORejection);
    //     //
    //     //     // todo...uncomment
    //     //     // post(remoteRoutes.workflowsManual, manualCSORejection, (resp: any) => {
    //     //     //         console.log(resp) // todo ... consider providing a message for both success and failure
    //     //     //     }, undefined,
    //     //     //     () => {
    //     //     //         window.location.href = window.location.origin
    //     //     //     }
    //     //     // )
    //     //
    //     //     setShowCommentBox(false)
    //     //
    //     // } else {
    //     //     Toast.warn("Please provide a rejection comment");
    //     // }
    //     //
    //
    // }
    //
    //
    // function showCommentDialog() {
    //     setShowCommentBox(true)
    // }

    // const theCheckList = checkListCSO() as IList<IPropsChecks>

    return (

        <Grid container item xs={12} className={classes.root}>

            <Grid item sm={4}>

                <Grid className={classes.expansion}>
                    <ExpansionCard title="Sender" children={<SenderDetails/>}/>
                </Grid>

                <Grid className={classes.expansion}>
                    <ExpansionCard title="Recipient" children={<BeneficiaryDetails/>}/>
                </Grid>

                <Grid className={classes.expansion}>
                    <ExpansionCard title="Transfer Request" children={<TransferDetails/>}/>
                </Grid>


                {

                    displayVerificationsByCSO()

                }

                {

                    // showVerificationsToBeDoneByBM()

                }

                {

                    displayVerificationsByBM()

                }

                {
                    displaySubmissionToFinacle()
                }


            </Grid>

            <Grid item sm={7} container alignContent={"center"} justify="center"
                  className={classes.dragAndDropAreaAfterScan}>

                <Grid container item xs={12}>
                    <img src={imageSrcFromBinary} className={classes.imageAfterScan} alt="scanned-result"/>
                </Grid>

            </Grid>

        </Grid>

    )
}

export default AllValidations