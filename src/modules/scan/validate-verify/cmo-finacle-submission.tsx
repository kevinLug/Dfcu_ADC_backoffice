import {IManualDecision, IWorkflow} from "../../workflows/types";
import {remoteRoutes, systemRoles} from "../../../data/constants";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import React, {useEffect, useState} from "react";
import {IWorkflowResponseMessage} from "../../transfers/types";
import {createStyles, makeStyles} from "@material-ui/core";
import {Theme} from "@material-ui/core/styles";
import {CMORejectionRemarks, IRemarks} from "./rejection-remarks-values";
import EditDialog from "../../../components/EditDialog";
import {Form, Formik} from "formik";
import RejectionRemarks from "./rejection-remarks";
import {IDataProps} from "./ValidationCheckList";
import {ICheckKeyValueState} from "../../../data/redux/checks/reducer";
import {useDispatch, useSelector} from "react-redux";
import {getChecksToPopulate, getDropdownSelectsToPopulate} from "../populateLabelAndValue";
import Toast from "../../../utils/Toast";
import {post} from "../../../utils/ajax";
import {ISelectKeyValueState} from "../../../data/redux/selects/reducer";
import {Dispatch} from "redux";


const useStylesInternal = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "contents"
        },
        submissionGrid: {
            marginTop: 35,
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

export interface IPropsCmoFinacleSubmission {
    workflowResponseMessage: IWorkflowResponseMessage;
    user: any;
    workflow: IWorkflow
}

interface ISubmitTransferRequestProps {
    showCommentDialog: () => void;
    submitTransferRequest: () => void
    isRejectBtnDisabled?: boolean
}

const SubmitTransferRequest = ({showCommentDialog, submitTransferRequest, isRejectBtnDisabled}: ISubmitTransferRequestProps) => {

    const classes = useStylesInternal()

    return <Grid item sm={12} className={classes.submissionGrid}>

        <Box className={classes.submissionBox}>

            <Button type="submit" variant="contained" color="primary" disabled={isRejectBtnDisabled} onClick={submitTransferRequest}>POST TO FINACLE</Button>

            <Button variant="contained" className={classes.rejectButton} onClick={showCommentDialog}>Reject</Button>

        </Box>

    </Grid>

}

const CmoFinacleSubmission = ({workflowResponseMessage, user, workflow}: IPropsCmoFinacleSubmission) => {

    const classes = useStylesInternal()
    const [showCommentBox, setShowCommentBox] = useState(false)
    const {check}: ICheckKeyValueState = useSelector((state: any) => state.checks)
    const [rejectionComment, setRejectionComment] = useState('')
    const [isRejectBtnDisabled, setRejectBtnDisabled] = useState(false)
    const initialData: IDataProps = {
        checks: check.checks,
        rejectionComment: rejectionComment
    }
    const [data, setData] = useState(initialData)
    const {select}: ISelectKeyValueState = useSelector((state: any) => state.selects)
    const dispatch: Dispatch<any> = useDispatch();

    useEffect(() => {
        console.log(workflow.tasks[2].actions[0].status)
    }, [dispatch, check, workflow, rejectionComment, data])


    function prepareFinacleData() {

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
            caseId: caseId,
            username: user.name
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

        // post(remoteRoutes.workflowsManual, manualCMOApproval, (resp: any) => {
        //         console.log(resp) // todo ... consider providing a message for both success and failure
        //     }, undefined,
        //     () => {
        //
        //         window.location.href = window.location.origin
        //     }
        // )

    }

    // submit to finacle
    // hasAnyRole(user, [systemRoles.CMO]) && workflow.subStatus === WorkflowSubStatus.AwaitingSubmissionToFinacle ?

    function handleCMORejection() {

        let data = {...getChecksToPopulate(check.checks)}

        let dropdownSelects = getDropdownSelectsToPopulate(select.selects)

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
        const comment = dropdownSelects[systemRoles.CMO]
        console.log("bmo:", comment)

        // @ts-ignore
        data["isRejected"] = true;
        // @ts-ignore
        data["clearedBy"] = user.name
        // @ts-ignore
        // data["timestamp"] = new Date()
        const manualBMRejection: IManualDecision = {
            caseId: caseId,
            taskName: "cmo-approval", // todo ...consider making these constants
            actionName: "cmo-transfer-details-approval",
            resumeCase: true,
            nextSubStatus: "AwaitingSubmissionToFinacle",
            data: {...data, rejectionComment: comment},
            override: false
        }

        console.log("manual-time:", manualBMRejection)

        // if (manualBMRejection.data.rejectionComment.trim().length === 0) {
        //     Toast.warn("Please provide a rejection comment...");
        //     setTimeout(() => {
        //         Toast.warn("Not submitted...");
        //     }, 2000)
        //     return;
        // }
        console.log("manual-bm:", manualBMRejection)

        // post(remoteRoutes.workflowsManual, manualBMRejection, (resp: any) => {
        //         console.log(resp) // todo ... consider providing a message for both success and failure
        //     }, undefined,
        //     () => {
        //
        //         window.location.href = window.location.origin
        //     }
        // )
    }

    function submitTransferRequest() {
        prepareFinacleData()
    }

    function cancelCommentDialog() {
        setShowCommentBox(false)
    }

    function showCommentDialog() {
        setShowCommentBox(true)
    }

    const remarks: IRemarks = CMORejectionRemarks()

    return <Grid className={classes.root}>

        {
            showCommentBox ? <EditDialog open={true} onClose={() => {
                }} title="Reject with a reason (comment)" disableBackdropClick={false}>
                    <Grid item sm={12}>

                        <Formik enableReinitialize initialValues={data} onSubmit={async values => {
                            await new Promise(resolve => {

                                setTimeout(resolve, 500)

                                handleCMORejection()

                            });

                        }}
                        >
                            <Form>

                                <RejectionRemarks remarks={remarks.remarks} role={remarks.role}/>

                                <Grid item sm={12} className={classes.submissionGrid}>

                                    <Box className={classes.submissionBox}>

                                        <Button variant="contained" className={classes.rejectButton} onClick={cancelCommentDialog}>Cancel</Button>

                                        <Button type="submit" variant="contained" color="primary" disabled={isRejectBtnDisabled} onSubmit={handleCMORejection}>Confirm</Button>

                                    </Box>

                                </Grid>

                            </Form>

                        </Formik>

                    </Grid>
                </EditDialog>
                :
                ""
        }

        <SubmitTransferRequest showCommentDialog={showCommentDialog} submitTransferRequest={submitTransferRequest}/>

    </Grid>

}

export default CmoFinacleSubmission