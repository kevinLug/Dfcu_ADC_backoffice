// todo...to be cleaned up
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {IState} from "../../../data/types";
import Grid, {GridSpacing} from "@material-ui/core/Grid";
import {ICheckKeyValueState} from "../../../data/redux/checks/reducer";
import {IWorkflowResponseMessageState} from "../../../data/redux/workflow-response/reducer";
import {Dispatch} from "redux";
import {IList, List} from "../../../utils/collections/list";
import CheckBoxTemplate, {addCheck, IPropsChecks} from "./Check";
import {getChecksToPopulate} from "../populateLabelAndValue";
import {ActionStatus, IManualDecision, IWorkflow, WorkflowSubStatus} from "../../workflows/types";
import {post} from "../../../utils/ajax";
import {hasAnyRole, remoteRoutes, systemRoles} from "../../../data/constants";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import {createStyles, makeStyles, TextareaAutosize} from "@material-ui/core";
import {Theme} from "@material-ui/core/styles";
import EditDialog from "../../../components/EditDialog";
import {Form, Formik} from "formik";
import {IDataProps} from "./ValidationCheckList";
import Toast from "../../../utils/Toast";

interface IPropsBMO {
    workflow: IWorkflow
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

const useStylesRejection = makeStyles(() =>
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

const VerificationByBMO = ({workflow}: IPropsBMO) => {

    const classesRejection = useStylesRejection()
    const [isRejectBtnDisabled, setRejectBtnDisabled] = useState(false)

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
    const [rejectionComment, setRejectionComment] = useState('')

    const dispatch: Dispatch<any> = useDispatch();
    const [remarks] = useState(bMORemarks())

    const initialData: IDataProps = {
        checks: check.checks,
        rejectionComment: rejectionComment
    }
    const [data, setData] = useState(initialData)

    //todo...try to sieve by action name
    useEffect(() => {
        console.log(workflow.tasks[2].actions[0].status)
    }, [dispatch, check, workflow, rejectionComment, data])

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

        // console.log("bm crit:", criteriaObj)
        // console.log("bm status:", actionBmStatus)
        // console.log("cso status:", actionCSOStatus)

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


    function showCommentDialog() {
        setShowCommentBox(true)
    }

    function handleChange(event: React.ChangeEvent<{ value: any }>) {
        console.log(`on change: `, event.target.value)
        setRemark(event.target.value)
    }

    function setComment(e: any) {
        setRejectionComment(e.target.value)
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
        // @ts-ignore
        data["approvedBy"] = user.name
        // @ts-ignore
        data["timestamp"] = new Date()
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
                window.location.href = window.location.origin
            }
        )
    }


    const handleBMORejection = async () => {

        let data = {...getChecksToPopulate(check.checks)}
        console.log("mans:", data)
        const obj = {
            checks: data,
            rejectionComment: rejectionComment
        }
        console.log("mans-2:", obj)
        let caseId: string
        if (!workflowResponseMessage.caseId || workflowResponseMessage.caseId.includes("0000-0000")) {
            // @ts-ignore
            caseId = workflow.id
        } else {
            caseId = workflowResponseMessage.caseId
        }

        // @ts-ignore
        data["isRejected"] = true;
        // @ts-ignore
        data["approvedBy"] = user.name
        // @ts-ignore
        // data["timestamp"] = new Date()
        const manualBMRejection: IManualDecision = {
            caseId: caseId,
            taskName: "bm-approval", // todo ...consider making these constants
            actionName: "bm-transfer-details-approval",
            resumeCase: true,
            nextSubStatus: "BMApprovalSuccessful",
            data: {...data, rejectionComment: obj.rejectionComment},
            override: false
        }

        if (manualBMRejection.data.rejectionComment.trim().length === 0) {
            Toast.warn("Please provide a rejection comment...");
            setTimeout(()=> {
                Toast.warn("Not submitted...");
            },2000)
            return;
        }
        console.log("manual-bm:", manualBMRejection)

        post(remoteRoutes.workflowsManual, manualBMRejection, (resp: any) => {
                console.log(resp) // todo ... consider providing a message for both success and failure
            }, undefined,
            () => {

                window.location.href = window.location.origin
            }
        )
    }


    const prepareFinacleData = async () => {

        let caseId: string
        if (!workflowResponseMessage.caseId || workflowResponseMessage.caseId.includes("0000-0000")) {
            // @ts-ignore
            caseId = workflow.id
        } else {
            caseId = workflowResponseMessage.caseId
        }

        const session = {
            userId: user.sub,
            sessionId: user.sid,
            caseId: caseId
        }

        const transferDetails = {
            currencyCode: workflow.caseData.transferDetails.currencyCode,
            transAmount: workflow.caseData.transferDetails.transactionAmount,
            exchangeRate: workflow.caseData.transferDetails.exchangeRate,
            remittanceMode: "SWIFT",
            countryCode: workflow.caseData.beneficiaryDetails.address.countryCode,
            branchCode: workflow.caseData.transferDetails.branchCode,
            transferPurpose: workflow.caseData.transferDetails.transferPurpose,
            chargeMode: workflow.caseData.charges.chargeMode,

            swiftCode: workflow.caseData.bankDetails.beneficiaryBank.swiftCode,
            sortCode: workflow.caseData.bankDetails.beneficiaryBank.sortCode,
            aba: workflow.caseData.bankDetails.beneficiaryBank.aba,
            fedwire: workflow.caseData.bankDetails.beneficiaryBank.fedwire,
            ifsc: workflow.caseData.bankDetails.beneficiaryBank.ifsc,
            iban: workflow.caseData.bankDetails.beneficiaryBank.iban,
        }

        const applicantDetails = {
            fullName: workflow.caseData.applicantDetails.fullName,
            accountNumber: workflow.caseData.applicantDetails.accountNumber,

            applicantAddress: {
                town: workflow.caseData.applicantDetails.address.town,
                plotNumber: workflow.caseData.applicantDetails.address.plotNumber,
                street: workflow.caseData.applicantDetails.address.street,
                district: workflow.caseData.applicantDetails.address.district,
            }
        };

        const beneficiaryDetails = {
            fullName: workflow.caseData.beneficiaryDetails.fullName,
            accountNumber: workflow.caseData.beneficiaryDetails.accountNumber,
            beneficiaryAddress: {
                town: workflow.caseData.beneficiaryDetails.address.town,
                country: workflow.caseData.beneficiaryDetails.address.countryCode,
                physicalAddress: workflow.caseData.beneficiaryDetails.address.physicalAddress
            }
        }

        const finacleData = {
            session: session,
            caseId: caseId,
            transferDetails: transferDetails,
            applicantDetails: applicantDetails,
            beneficiaryDetails: beneficiaryDetails
        }

        console.log("finacleData: ", finacleData)

        const manualCMOApproval: IManualDecision = {
            caseId: caseId,
            taskName: "cmo-approval", // todo ...consider making these constants
            actionName: "cmo-transfer-details-approval",
            resumeCase: true,
            nextSubStatus: "AwaitingSubmissionToFinacle",
            data: finacleData,
            override: false
        }

        console.log("manual-bm:", manualCMOApproval)

        post(remoteRoutes.workflowsManual, manualCMOApproval, (resp: any) => {
                console.log(resp) // todo ... consider providing a message for both success and failure
            }, undefined,
            () => {

                window.location.href = window.location.origin
            }
        )

    }


    return <Grid>


        {
            // eslint-disable-next-line array-callback-return
            checksReviewConfirmation().toArray().map((val, index) => {

                // if ((workflow.tasks[2].actions[0].status !== ActionStatus.Pending) && val.name.startsWith(v.name)) {
                //     return <SuccessFailureDisplay value={val.value} label={val.label} name={val.name}
                //                                   key={v.name}/>
                // }
                //
                // // todo...user will have to be BM
                // if (val.name.startsWith(v.name) && csoOrBmRolesForDev(user))
                //     return <CheckBoxTemplate key={val.name} value={val.value} label="confirm"
                //                              name={val.name}/>

                return <Grid key={index} item sm={12}>
                    <CheckBoxTemplate value={val.value} label={val.label} name={val.name}/>
                </Grid>


            })
        }

        {/*{*/}

        {/*    checksReview().toArray().map((v, index) => {*/}
        {/*        return <Grid key={index} style={index % 2 ? {background: "#fcf6ea"} : {background: "#fdf9f1"}}>*/}
        {/*            {*/}

        {/*                <SuccessFailureDisplay value={v.value} label={v.label} name={v.name} key={v.name}/>*/}

        {/*            }*/}


        {/*        </Grid>*/}
        {/*    })*/}

        {/*}*/}

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

            // todo...user role will have to be BM
            hasAnyRole(user, [systemRoles.BM, systemRoles.BMO]) && workflow.tasks[2].actions[0].status !== ActionStatus.Done && workflow.tasks[2].actions[0].status !== ActionStatus.Error ?
                <Grid item sm={12} className={classes.submissionGrid}>
                    <Box className={classes.submissionBox}>
                        <Button variant="contained" className={classes.rejectButton}
                                onClick={showCommentDialog}>Reject--</Button>
                        <Button type="submit" variant="contained" color="primary"
                            // disabled={isRejectBtnDisabled}
                                onClick={handleBMApproval}
                        >Submit</Button>
                    </Box>
                </Grid>
                :
                ""
        }


        {
            // submit to finacle
            hasAnyRole(user, [systemRoles.CMO]) && workflow.subStatus === WorkflowSubStatus.AwaitingSubmissionToFinacle ?
                <Grid item sm={12} className={classes.submissionGrid}>
                    <Box className={classes.submissionBox}>
                        <Button variant="contained" className={classes.rejectButton}
                                onClick={showCommentDialog}>Reject</Button>
                        <Button type="submit" variant="contained" color="primary"
                            // disabled={isRejectBtnDisabled}
                                onClick={prepareFinacleData}
                        >Submit to Finacle</Button>
                    </Box>
                </Grid>
                :
                ""
        }

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
                                    handleBMORejection()
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

                                <Grid item sm={12} className={classesRejection.submissionGrid}>
                                    <Box className={classesRejection.submissionBox}>
                                        <Button variant="contained" className={classesRejection.rejectButton}
                                                onClick={cancelCommentDialog}>Cancel</Button>
                                        <Button type="submit" variant="contained" color="primary"
                                                disabled={isRejectBtnDisabled}
                                                onSubmit={handleBMORejection}>Confirm</Button>
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
}

export default VerificationByBMO