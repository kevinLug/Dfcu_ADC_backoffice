import {IManualDecision, IWorkflow} from "../../workflows/types";
import {ConstantLabelsAndValues, remoteRoutes, systemRoles} from "../../../data/constants";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import React, {useEffect, useState} from "react";
import {IWorkflowResponseMessage} from "../../transfers/types";
import {createStyles, makeStyles} from "@material-ui/core";
import {Theme} from "@material-ui/core/styles";
import {CMORejectionRemarks, IRemarks} from "./RejectionRemarksValues";
import EditDialog from "../../../components/EditDialog";
import {Form, Formik} from "formik";
import RejectionRemarks from "./RejectionRemarks";
import {IDataProps} from "./CsoValidationChecklist";
import {ICheckKeyValueState} from "../../../data/redux/checks/reducer";
import {useDispatch, useSelector} from "react-redux";
import {getChecksToPopulate, getDropdownSelectsToPopulate} from "../populateLabelAndValue";
import {post} from "../../../utils/ajax";
import {ISelectKeyValueState} from "../../../data/redux/selects/reducer";
import {Dispatch} from "redux";
import {RequestType} from "../../workflows/config";
import {addDynamicPropertyToObject, isNullOrEmpty, isNullOrUndefined} from "../../../utils/objectHelpers";
import Toast from "../../../utils/Toast";


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
            transAmount: Number(workflow.caseData.transferDetails.transactionAmount),
            exchangeRate: workflow.caseData.transferDetails.exchangeRate,
            remittanceMode: workflow.type,
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

        let bankName: string
        let bankCode: string
        let branchCode: string

        const isTypeEftOrRtgs1 = workflow.type === RequestType.EFT || workflow.type === RequestType.RTGS_1;

        if (isTypeEftOrRtgs1) {

            const recipientBank = ConstantLabelsAndValues.mapOfRecipientBankCodeToValueOfBank().get(workflow.caseData.bankDetails.beneficiaryBank.bankName)
            // @ts-ignore
            bankName = recipientBank.name
            // @ts-ignore
            bankCode = recipientBank.bankCode
            // @ts-ignore
            branchCode = recipientBank.branchCode

        } else {
            bankName = workflow.caseData.bankDetails.beneficiaryBank.bankName
            const recipientBank = ConstantLabelsAndValues.mapOfRecipientNameToValueOfBank().get(workflow.caseData.bankDetails.beneficiaryBank.bankName)
            // @ts-ignore
            bankCode = recipientBank.name
            // @ts-ignore
            branchCode = recipientBank.branchCode
        }

        const beneficiaryDetails = {
            fullName: workflow.caseData.beneficiaryDetails.fullName,
            accountNumber: workflow.caseData.beneficiaryDetails.accountNumber,
            bankName: bankName,
            bankCode: bankCode,
            branchCode: branchCode,
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
                window.location.href = window.location.origin
            }, undefined,
            () => {

            }
        )

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

        if (isNullOrUndefined(comment) || isNullOrEmpty(comment)) {
            Toast.warn('Please select a reason')
            return
        }

        addDynamicPropertyToObject(data, 'isRejected', true)
        addDynamicPropertyToObject(data, 'clearedBy', user.name)

        const session = {
            userId: user.sub,
            sessionId: user.sid,
            caseId: caseId,
            username: user.name
        }

        addDynamicPropertyToObject(data,'session', session)

        const manualCMORejection: IManualDecision = {
            caseId: caseId,
            taskName: "cmo-approval", // todo ...consider making these constants
            actionName: "cmo-transfer-details-approval",
            resumeCase: true,
            nextSubStatus: "AwaitingSubmissionToFinacle",
            data: {...data, rejectionComment: comment},
            override: false
        }

        console.log("manual-time:", manualCMORejection)

        console.log("manual-bm:", manualCMORejection)

        post(remoteRoutes.workflowsManual, manualCMORejection, (resp: any) => {
                console.log(resp) // todo ... consider providing a message for both success and failure
                window.location.href = window.location.origin
            }, undefined,
            () => {

                window.location.href = window.location.origin
            }
        )
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

                                        <Button type="submit" variant="contained" color="primary" disabled={isRejectBtnDisabled} onSubmit={handleCMORejection}>OK</Button>

                                        <Button variant="contained" className={classes.rejectButton} onClick={cancelCommentDialog}>Cancel</Button>

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