import Grid, {GridSpacing} from "@material-ui/core/Grid";
import ExpansionCard from "../../../components/ExpansionCard";
import SenderDetails from "./SenderDetails";
import BeneficiaryDetails from "./BeneficiaryDetails";
import TransferDetails from "./TransferDetails";

import React, {useEffect, useState} from "react";
import {ActionStatus, IManualDecision, IWorkflow, WorkflowSubStatus} from "../../workflows/types";
import {ICase, ICaseData} from "../../transfers/types";
import {IList, List} from "../../../utils/collections/list";
import CheckBoxTemplate, {addCheck, IPropsChecks} from "./Check";
import {actionICaseState} from "../../../data/redux/transfers/reducer";
import {Dispatch} from "redux";
import {useDispatch, useSelector} from "react-redux";
import {useStyles} from "../ScanCrop";
import {IState} from "../../../data/types";
import {ErrorIcon, SuccessIcon} from "../../../components/xicons";
import Typography from "@material-ui/core/Typography";
import ValidationCheckList, {checkListCSO} from "./ValidationCheckList";
import ImageUtils from "../../../utils/imageUtils";
import {hasAnyRole, remoteRoutes, systemRoles} from "../../../data/constants";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import {createStyles, makeStyles} from "@material-ui/core";
import {Theme} from "@material-ui/core/styles";
import {getChecksToPopulate} from "../populateLabelAndValue";
import {post} from "../../../utils/ajax";
import {ICheckKeyValueState} from "../../../data/redux/checks/reducer";
import {IWorkflowResponseMessageState} from "../../../data/redux/workflow-response/reducer";

interface IProps {
    workflow: IWorkflow
}

interface IPropsBMO {
    workflow: IWorkflow
}

interface IRemarks {
    reason: string;
    requestStatus: string;
}

function addRemarkToList(list: IList<IRemarks>, reason: string, requestStatus: string) {
    const aRemark: IRemarks = {
        reason,
        requestStatus
    }
    list.add(aRemark);
}

function bMORemarks() {

    const remarks: IList<IRemarks> = new List();

    addRemarkToList(remarks, "Instruction is not signed as per mandate", "Rejected");

    addRemarkToList(remarks, "Sender's account number is invalid", "Rejected");

    addRemarkToList(remarks, "Sender has insufficient funds", "Rejected");

    addRemarkToList(remarks, "Recipient's details are incomplete", "Rejected");

    addRemarkToList(remarks, "Forex details are incorrect", "Rejected");

    return remarks

}

export const SuccessFailureDisplay = (v: IPropsChecks) => {

    const [superScript, setSuperScript] = useState('')

    useEffect(() => {
        setSuperScriptValue()
    })

    function setSuperScriptValue() {
        const name = v.name.toLowerCase()

        if (name.includes("confirmation")) {
            setSuperScript("BM")
        } else {
            setSuperScript("CSO")
        }
    }


    return v.value ?
        <Typography
            variant='subtitle1'
            style={{marginTop: 1}}>
            &nbsp;
            <SuccessIcon
                fontSize='inherit'
            />
            {v.label}
            <sup><i>{superScript}</i></sup>
        </Typography>

        :
        <Typography
            variant='subtitle1'
            style={{marginTop: 1}}>
            &nbsp;
            <ErrorIcon
                fontSize='inherit'
            />
            {v.label}
            <sup><i>{superScript}</i></sup>
        </Typography>
}

const useStylesInternal = makeStyles((theme: Theme) =>
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
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },


        bmConfirm: {
            fontWeight: 20
        }
    })
);

// todo...to be cleaned up
const VerificationByBMO = ({workflow}: IPropsBMO) => {
    const classes = useStylesInternal()
    const [theWorkflow] = useState(workflow)
    const criteria = theWorkflow.tasks[1].actions[0].outputData
    const criteriaBm = theWorkflow.tasks[2].actions[0].outputData

    const actionCSOStatus = theWorkflow.tasks[1].actions[0].status
    const actionBmStatus = theWorkflow.tasks[2].actions[0].status

    const user = useSelector((state: IState) => state.core.user)
    const [showCommentBox, setShowCommentBox] = useState(false)
    const [remark, setRemark] = useState('')
    const [spacing, setSpacing] = React.useState<GridSpacing>(2);


    const {check}: ICheckKeyValueState = useSelector((state: any) => state.checks)
    // const {workflow}: IWorkflowState = useSelector((state: any) => state.workflows)

    const {workflowResponseMessage}: IWorkflowResponseMessageState = useSelector((state: any) => state.workflowResponse)

    const dispatch: Dispatch<any> = useDispatch();
    const [remarks] = useState(bMORemarks())

    //todo...try to sieve by action name
    useEffect(() => {
        console.log(workflow.tasks[2].actions[0].status)
    }, [workflow])

    const checksReview = (): IList<IPropsChecks> => {
        const criteriaObj = JSON.parse(criteria)

        console.log("criteria:", criteriaObj)
        console.log("criteria-sub-status:", workflow.subStatus)


        const theCheckList = new List<IPropsChecks>();
        theCheckList.add(addCheck("Transfer request is signed as per account mandate", "isTransferSignedAsPerAccountMandate_Bm"))
        theCheckList.add(addCheck("Transfer requires forex", "transferRequiresForex_Bm"))
        theCheckList.add(addCheck("Sender's account number is correct", "isSenderAccountNumberCorrect_Bm"))
        theCheckList.add(addCheck("Sender has sufficient funds", "senderHasSufficientFunds_Bm"))
        theCheckList.add(addCheck("Recipient's bank details are complete", "isRecipientBankDetailsComplete_Bm"))
        theCheckList.add(addCheck("Recipient's physical address is complete (TTs)", "isRecipientPhysicalAddressComplete_Bm"))

        for (let aCheck of theCheckList) {

            const propertyName: string = aCheck.name.split("_")[0];
            aCheck.value = criteriaObj[propertyName]
            // console.log("aCheck:", aCheck)
        }

        return theCheckList

    }

    const checksReviewConfirmation = (): IList<IPropsChecks> => {
        const criteriaObj = JSON.parse(criteriaBm)

        console.log("bm crit:", criteriaObj)
        console.log("bm status:", actionBmStatus)
        console.log("cso status:", actionCSOStatus)

        const theCheckList = new List<IPropsChecks>();
        theCheckList.add(addCheck("Transfer request is signed as per account mandate", "isTransferSignedAsPerAccountMandate_Bm_Confirmation"))
        theCheckList.add(addCheck("Transfer requires forex", "transferRequiresForex_Bm_confirmation"))
        theCheckList.add(addCheck("Sender's account number is correct", "isSenderAccountNumberCorrect_Bm_Confirmation"))
        theCheckList.add(addCheck("Sender has sufficient funds", "senderHasSufficientFunds_Bm_Confirmation"))
        theCheckList.add(addCheck("Recipient's bank details are complete", "isRecipientBankDetailsComplete_Bm_Confirmation"))
        theCheckList.add(addCheck("Recipient's physical address is complete (TTs)", "isRecipientPhysicalAddressComplete_Bm_Confirmation"))

        if (criteriaObj !== null && criteriaObj !== undefined) {

            for (let aCheck of theCheckList) {

                console.log('a-check:', aCheck)
                // const propertyName: string = aCheck.name.split("_")[0];
                const propertyName: string = aCheck.name;
                aCheck.value = criteriaObj[propertyName]
                // console.log("aCheck:", aCheck)
            }

        }


        return theCheckList

    }


    function cancelCommentDialog() {
        setShowCommentBox(false)
    }

    function handleChange(event: React.ChangeEvent<{ value: any }>) {
        console.log(`on change: `, event.target.value)
        setRemark(event.target.value)
    }

    const handleBMApproval = async () => {

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
        const manualBMApproval: IManualDecision = {
            caseId: caseId,
            taskName: "bm-approval", // todo ...consider making these constants
            actionName: "bm-transfer-details-approval",
            resumeCase: true,
            nextSubStatus: "BMApprovalSuccessful",
            data: data,
            override: false
        }

        console.log("manual-bm:", manualBMApproval)

        post(remoteRoutes.workflowsManual, manualBMApproval, (resp: any) => {
                console.log(resp) // todo ... consider providing a message for both success and failure
            }, undefined,
            () => {
                // todo...uncomment this
                // window.location.href = window.location.origin
            }
        )
    }


    return <Grid>

        {

            checksReview().toArray().map((v, index) => {
                return <Grid key={index} style={index % 2 ? {background: "#fcf6ea"} : {background: "#fdf9f1"}}>
                    {

                        <SuccessFailureDisplay value={v.value} label={v.label} name={v.name} key={v.name} />

                    }

                    {
                        // eslint-disable-next-line array-callback-return
                        checksReviewConfirmation().toArray().map(val => {

                            if ((workflow.tasks[2].actions[0].status !== ActionStatus.Pending) && val.name.startsWith(v.name)) {
                                return <SuccessFailureDisplay value={val.value} label={val.label} name={val.name} key={v.name} />
                            }

                            if (val.name.startsWith(v.name) && hasAnyRole(user, [systemRoles.BM]))
                                return <CheckBoxTemplate key={val.name} value={val.value} label="confirm"
                                                         name={val.name}/>


                        })
                    }

                </Grid>
            })

        }

        {/*<FormControl className={classes.formControl}>*/}
        {/*    <InputLabel margin="dense">Remarks</InputLabel>*/}
        {/*    <Select*/}
        {/*        labelId="demo-simple-select-label"*/}
        {/*        id="demo-simple-select"*/}
        {/*        value={remark}*/}
        {/*        onChange={handleChange}*/}
        {/*    >*/}
        {/*        {*/}
        {/*            remarks.toArray().map(remark => {*/}
        {/*                return <MenuItem key={remark.reason} value={remark.reason}>{remark.reason}</MenuItem>*/}
        {/*            })*/}
        {/*        }*/}
        {/*    </Select>*/}
        {/*</FormControl>*/}

        {

            hasAnyRole(user, [systemRoles.BM]) && workflow.tasks[2].actions[0].status !== ActionStatus.Done && workflow.tasks[2].actions[0].status !== ActionStatus.Error ?
                <Grid item sm={12} className={classes.submissionGrid}>
                    <Box className={classes.submissionBox}>
                        <Button variant="contained" className={classes.rejectButton}
                                onClick={cancelCommentDialog}>Cancel</Button>
                        <Button type="submit" variant="contained" color="primary"
                            // disabled={isRejectBtnDisabled}
                                onClick={handleBMApproval}
                        >Submit</Button>
                    </Box>
                </Grid>
                :
                ""
        }


    </Grid>
}

const BmVerificationRtgs = ({workflow}: IProps) => {

    const classes = useStyles();
    const [imageSrcFromBinary, setImageSrcFromBinary] = useState<string>("")
    const user = useSelector((state: IState) => state.core.user)
    const dispatch: Dispatch<any> = useDispatch();

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

    }, [dispatch, workflow])

    const theCheckList = checkListCSO() as IList<IPropsChecks>

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

                <Grid className={classes.expansion}>

                    {

                        workflow.subStatus === WorkflowSubStatus.AwaitingCSOApproval ?

                            <ExpansionCard title="Verification list"
                                           children={<ValidationCheckList theCheckList={theCheckList}/>}/>
                            :
                            <ExpansionCard title="Verification list"
                                           children={<VerificationByBMO workflow={workflow}/>}/>

                    }

                </Grid>

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

export default BmVerificationRtgs