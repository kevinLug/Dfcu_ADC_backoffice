import Grid from "@material-ui/core/Grid";
import ExpansionCard from "../../../components/ExpansionCard";
import SenderDetails from "./SenderDetails";
import BeneficiaryDetails from "./BeneficiaryDetails";
import TransferDetails from "./TransferDetails";

import React, {useEffect, useState} from "react";
import {IWorkflow, WorkflowStatus, WorkflowSubStatus} from "../../workflows/types";
import {ICase, ICaseData, IForex, IForexDefault} from "../../transfers/types";

import {actionICaseState} from "../../../data/redux/transfers/reducer";
import {Dispatch} from "redux";
import {useDispatch, useSelector} from "react-redux";
import {useStyles} from "../ScanCrop";
import {IState} from "../../../data/types";
import CsoValidationChecklist from "./CsoValidationChecklist";
import ImageUtils from "../../../utils/imageUtils";

import {ConstantLabelsAndValues, hasAnyRole, systemRoles} from "../../../data/constants";

import {ICheckKeyValueState} from "../../../data/redux/checks/reducer";
import VerificationsAlreadyDoneByCSO from "./ChecksAlreadyDoneByCso";
import VerificationsAlreadyDoneByBM from "./ChecksAlreadyDoneByBom";
import VerificationByBmo from "./VerificationByBmo";
import CmoFinacleSubmission from "./CmoFinacleSubmission";
import {IWorkflowResponseMessageState} from "../../../data/redux/workflow-response/reducer";
import Typography from "@material-ui/core/Typography";

import Divider from "@material-ui/core/Divider";
import {getChecksToPopulate} from "../populateLabelAndValue";
import {IList, List} from "../../../utils/collections/list";
import {IPropsChecks} from "./Check";
import {isNullOrUndefined} from "../../../utils/objectHelpers";

interface IProps {
    workflow: IWorkflow;
}

const AllValidations = ({workflow}: IProps) => {

    const classes = useStyles();
    const [imageSrcFromBinary, setImageSrcFromBinary] = useState<string>("")
    const user = useSelector((state: IState) => state.core.user)
    const dispatch: Dispatch<any> = useDispatch();

    const {check}: ICheckKeyValueState = useSelector((state: any) => state.checks)
    const {workflowResponseMessage}: IWorkflowResponseMessageState = useSelector((state: any) => state.workflowResponse)
    const [forexDetailsFound, setForexDetailsFound] = useState<IForex>(IForexDefault)
    const [isForexRequired, setForexRequired] = useState<boolean>(false)
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

        const blob = ImageUtils.arrayBufferToBlob(arrayBuffer)

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = (event: any) => {
            const base64 = event.target.result
            setImageSrcFromBinary(base64)
        };


        // !isNullOrUndefined(forexDetailsFound) && !isNullOrEmpty(forexDetailsFound.rate.toString())

        if (
            workflow.subStatus === WorkflowSubStatus.AwaitingBMApproval ||
            workflow.subStatus === WorkflowSubStatus.FailedCSOApproval ||
            workflow.subStatus === WorkflowSubStatus.FailedBMApproval ||
            workflow.subStatus === WorkflowSubStatus.AwaitingClearingDeptApproval ||
            workflow.status === WorkflowStatus.Closed
        ) {

            if (workflow.tasks[1].actions[0].outputData){

                const parsed = JSON.parse(workflow.tasks[1].actions[0].outputData)

                if (parsed['forexDetails']){
                    setForexRequired(true)
                    setForexDetailsFound(parsed['forexDetails'])
                }

            }

        }


    }, [dispatch, check, workflow])

    function checksReviewCSO(): IList<IPropsChecks> {

        // @ts-ignore
        const checkValues = getChecksToPopulate(check.checks)

        const theCheckList = new List<IPropsChecks>()

        for (const oneCheck of ConstantLabelsAndValues.csoValidationCheckList()) {

            const name = oneCheck.name
            const label = oneCheck.label
            // @ts-ignore
            const value = checkValues[name]

            if (!isNullOrUndefined(value)) {
                const item: IPropsChecks = {name, value, label}
                theCheckList.add(item)
            } else {
                const item: IPropsChecks = {
                    name,
                    label,
                    value: false
                }
                theCheckList.add(item)
            }

        }



        return theCheckList
    }

    function displayVerificationsByCSO() {

        // still awaiting CSO approval
        if (workflow.subStatus === WorkflowSubStatus.AwaitingCSOApproval && hasAnyRole(user, [systemRoles.CSO]))


            return <Grid className={classes.expansion}>
                <Typography variant="h4">Validation Checklist</Typography>


                <CsoValidationChecklist theCheckList={checksReviewCSO()}/>
                {/*<CsoValidationChecklist theCheckList={ConstantLabelsAndValues.csoValidationCheckList()}/>*/}
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

        if (workflow.subStatus === WorkflowSubStatus.FailedCSOApproval && hasAnyRole(user, [systemRoles.BOM, systemRoles.BM])) {
            return <Grid className={classes.expansion}>
                <Typography variant="h4">CSO Validation Checklist</Typography>
                <VerificationsAlreadyDoneByCSO workflow={workflow}/>
            </Grid>
        }

        if (workflow.subStatus === WorkflowSubStatus.AwaitingBMApproval && hasAnyRole(user, [systemRoles.BM, systemRoles.BOM]))
            return <Grid className={classes.expansion}>
                <Typography variant="h4">CSO Validation Checklist</Typography>
                <VerificationsAlreadyDoneByCSO workflow={workflow}/>

                <Divider style={{padding: 10}} light={true} orientation='horizontal' variant="middle"/>

                <Typography variant="h4">Validation Checklist</Typography>
                <VerificationByBmo workflow={workflow}/>
            </Grid>

        if ((workflow.subStatus.includes(WorkflowSubStatus.AwaitingSubmissionToFinacle) || workflow.subStatus.includes(WorkflowSubStatus.FailedBMApproval))
            && hasAnyRole(user, [systemRoles.BM, systemRoles.BOM]))
            return <Grid className={classes.expansion}>

                <Typography variant="h4">CSO Validation Checklist</Typography>
                <VerificationsAlreadyDoneByCSO workflow={workflow}/>

                <Divider style={{padding: 10}} light={true} orientation='horizontal' variant="middle"/>

                <Typography variant="h4">Validation Checklist</Typography>
                <VerificationsAlreadyDoneByBM workflow={workflow}/>

            </Grid>
    }

    function displaySubmissionToFinacle() {
        if (workflow.subStatus === WorkflowSubStatus.AwaitingSubmissionToFinacle && hasAnyRole(user, [systemRoles.CMO])) {
            return <Grid className={classes.expansion}>
                <Typography variant="h4">Submit to Finacle</Typography>
                <CmoFinacleSubmission user={user} workflowResponseMessage={workflowResponseMessage} workflow={workflow}/>
            </Grid>
        }
    }

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
                    <ExpansionCard title="Transfer Request" children={<TransferDetails isForexRequired={isForexRequired} forexDetailsReceived={forexDetailsFound}/>}/>
                </Grid>

                {
                    displayVerificationsByCSO()
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