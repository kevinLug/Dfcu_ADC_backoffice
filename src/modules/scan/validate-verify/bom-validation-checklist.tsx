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
import CsoValidationChecklist from "./cso-validation-checklist";
import ImageUtils from "../../../utils/imageUtils";
// import {csoOrBmRolesForDev, remoteRoutes} from "../../../data/constants";
import {ConstantLabelsAndValues, hasAnyRole, systemRoles} from "../../../data/constants";
// import {createStyles, makeStyles} from "@material-ui/core";
import {ICheckKeyValueState} from "../../../data/redux/checks/reducer";
import VerificationsAlreadyDoneByCSO from "./checks-already-done-by-cso";
import VerificationsAlreadyDoneByBM from "./checks-already-done-by-bom";
import VerificationByBMO from "./verification-by-bmo";
import CmoFinacleSubmission from "./cmo-finacle-submission";
import {IWorkflowResponseMessageState} from "../../../data/redux/workflow-response/reducer";
import Typography from "@material-ui/core/Typography";

interface IProps {
    workflow: IWorkflow
}

// const useStylesDialog = makeStyles(() =>
//     createStyles({
//         submissionGrid: {
//             marginTop: 35
//         },
//         submissionBox: {
//             display: 'flex',
//             justifyContent: 'space-between'
//         },
//         rejectButton: {
//             backgroundColor: '#b32121',
//             color: 'white'
//         }
//
//     })
// );

//
// const VerificationsAlreadyDoneByCSO = ({workflow}: IPropsBMO) => {
//     const [theWorkflow] = useState(workflow)
//     const criteria = theWorkflow.tasks[1].actions[0].outputData
//
//     //todo...try to sieve by action name
//     useEffect(() => {
//         console.log('testing: ', workflow.tasks[2].actions[0].status)
//     }, [workflow, criteria])
//
//     const checksReview = (): IList<IPropsChecks> => {
//         const criteriaObj = JSON.parse(criteria)
//
//         console.log("criteria:", criteriaObj)
//         console.log("criteria-sub-status:", workflow.subStatus)
//
//         const theCheckList = new List<IPropsChecks>();
//         theCheckList.add(addCheck("Transfer request is signed as per account mandate", "isTransferSignedAsPerAccountMandate_Bm"))
//         theCheckList.add(addCheck("Transfer requires forex", "transferRequiresForex_Bm"))
//         theCheckList.add(addCheck("Sender's account number is correct", "isSenderAccountNumberCorrect_Bm"))
//         theCheckList.add(addCheck("Sender has sufficient funds", "senderHasSufficientFunds_Bm"))
//         theCheckList.add(addCheck("Recipient's bank details are complete", "isRecipientBankDetailsComplete_Bm"))
//         theCheckList.add(addCheck("Recipient's physical address is complete (TTs)", "isRecipientPhysicalAddressComplete_Bm"))
//
//         for (let aCheck of theCheckList) {
//
//             const propertyName: string = aCheck.name.split("_")[0];
//             aCheck.value = criteriaObj[propertyName]
//             // console.log("aCheck:", aCheck)
//         }
//
//         return theCheckList
//
//     }
//
//     return <Grid>
//         {
//
//             checksReview().toArray().map((v, index) => {
//                 return <Grid key={index} style={index % 2 ? {background: "#fcf6ea"} : {background: "#fdf9f1"}}>
//                     {
//
//                         <SuccessFailureDisplay value={v.value} label={v.label} name={v.name} key={v.name}/>
//
//                     }
//
//                 </Grid>
//             })
//
//         }
//     </Grid>
// }

// const useStylesRejection = makeStyles(() =>
//     createStyles({
//         submissionGrid: {
//             marginTop: 35
//         },
//         submissionBox: {
//             display: 'flex',
//             justifyContent: 'space-between'
//         },
//         rejectButton: {
//             backgroundColor: '#b32121',
//             color: 'white'
//         }
//
//     })
// );

const BomValidationChecklist = ({workflow}: IProps) => {

    // const classesDialog = useStylesDialog()
    // const classesRejection = useStylesRejection()

    const classes = useStyles();
    const [imageSrcFromBinary, setImageSrcFromBinary] = useState<string>("")
    const user = useSelector((state: IState) => state.core.user)
    const dispatch: Dispatch<any> = useDispatch();

    // const [rejectionComment, setRejectionComment] = useState('')
    const {check}: ICheckKeyValueState = useSelector((state: any) => state.checks)
    // const initialData: IDataProps = {
    //     checks: check.checks,
    //     rejectionComment: rejectionComment
    // }
    // const [data] = useState(initialData)
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

        // todo .. sprout this step (for re-usability)...also used in ScanCrop.tsx
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
                <Typography variant="h4">Verification Checklist</Typography>
                <CsoValidationChecklist theCheckList={ConstantLabelsAndValues.csoValidationCheckList()}/>
                {/*<ExpansionCard title="Verification  Checklist" children={<CsoValidationChecklist theCheckList={theCheckList}/>}/>*/}
            </Grid>

        // show verifications done by CSO if process awaits BM action, CMO action, or erred
        // if (workflow.subStatus.includes("BM") || workflow.subStatus.includes("Finacle") || workflow.subStatus.includes("Fail"))
        //     return <Grid className={classes.expansion}>
        //         <ExpansionCard title="Checklist results - CSO" children={<VerificationsAlreadyDoneByCSO workflow={workflow}/>}/>
        //     </Grid>

    }

    function displayVerificationsByBM() {

        if (workflow.subStatus === WorkflowSubStatus.AwaitingBMApproval && hasAnyRole(user, [systemRoles.BM, systemRoles.BOM]))
            return <Grid className={classes.expansion}>
                <Typography variant="h4">Validation Checklist</Typography>
                <VerificationByBMO workflow={workflow}/>
            </Grid>

        // if (workflow.subStatus.includes(WorkflowSubStatus.AwaitingSubmissionToFinacle) || workflow.subStatus.includes(WorkflowSubStatus.FailedBMApproval))
        //     return <Grid className={classes.expansion}>
        //         <ExpansionCard title="Verification Checklist" children={<VerificationsAlreadyDoneByBM workflow={workflow}/>}/>
        //     </Grid>
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

                {/*todo... here..show the approvals of the CSO*/}
                {
                    // showChecksFormOrChecksResults()
                    // workflow.subStatus !== WorkflowSubStatus.AwaitingCSOApproval ?
                    //     <Grid className={classes.expansion}>
                    //         <ExpansionCard title="CSO Verification Result"
                    //                        children={<VerificationsAlreadyDoneByCSO workflow={workflow}/>}/>
                    //     </Grid> : ""
                }


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

export default BomValidationChecklist