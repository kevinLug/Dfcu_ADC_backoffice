import React, {ChangeEvent, useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {IPropsChecks} from "./Check";
import CheckBoxTemplate from "./Check";
import {IList} from "../../../utils/collections/list";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import {createStyles, makeStyles} from "@material-ui/core";
import {IWorkflowResponseMessageState} from "../../../data/redux/workflow-response/reducer";
import {useDispatch, useSelector} from "react-redux";

import {actionICheckKeyValue, ICheckKeyValueState} from "../../../data/redux/checks/reducer";

import {IManualDecision} from "../../workflows/types";

import {ConstantLabelsAndValues, hasAnyRole, remoteRoutes, systemRoles} from "../../../data/constants";

import {post} from "../../../utils/ajax";
import {getChecksToPopulate, getDropdownSelectsToPopulate} from "../populateLabelAndValue";
import {IWorkflowState} from "../../../data/redux/workflows/reducer";
import {Dispatch} from "redux";
import EditDialog from "../../../components/EditDialog";
import {Form, Formik} from 'formik';

import {IState} from "../../../data/types";
import VerificationsAlreadyDoneByCSO from "./checks-already-done-by-cso";
import Toast from "../../../utils/Toast";
import RejectionRemarks from "./rejection-remarks";
import {CSORejectionRemarks, IRemarks} from "./rejection-remarks-values";
import {ISelectKeyValueState} from "../../../data/redux/selects/reducer";
import RejectionDialog from "./rejection-dialog";
import RejectionForm from "./rejection-dialog";
import ForexForm from "./forex-dialog";
import {ICheckKeyValueDefault, IForex} from "../../transfers/types";
import {actionIForexValue, IForexValueState} from "../../../data/redux/forex/reducer";
import ObjectHelpersFluent from "../../../utils/objectHelpersFluent";

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

// export const checkListCSO = (): IList<IPropsChecks> => {
//
//     return theCheckList;
// }

const ValidationCheckList = ({theCheckList}: IProps) => {

    const classes = useStyles()
    const {workflowResponseMessage}: IWorkflowResponseMessageState = useSelector((state: any) => state.workflowResponse)

    const {check}: ICheckKeyValueState = useSelector((state: any) => state.checks)
    const {forexValue}: IForexValueState = useSelector((state: any) => state.forexDetails)
    const {workflow}: IWorkflowState = useSelector((state: any) => state.workflows)
    const user = useSelector((state: IState) => state.core.user)
    const {select}: ISelectKeyValueState = useSelector((state: any) => state.selects)
    const isNewTransferRequestStarted: boolean = useSelector((state: IState) => state.core.startNewTransferRequest)

    const dispatch: Dispatch<any> = useDispatch();

    const [showCommentBox, setShowCommentBox] = useState(false)
    const [isRejectBtnDisabled] = useState(false)
    const [showForexDetailsForm, setShowForexDetailsForm] = useState(false)

    const [rejectionComment] = useState('')

    const initialData: IDataProps = {
        checks: check.checks,
        rejectionComment: rejectionComment
    }

    const [data, setData] = useState(initialData)
    const [dataForexDetails, setDataForexDetails] = useState({})

    useEffect(() => {
        // console.log(check.checks)
        // setData({checks: getChecksToPopulate(check.checks), rejectionComment: rejectionComment})

        // @ts-ignore
        // setSubStatusFound(workflow.subStatus)

    }, [dispatch, check, workflow, rejectionComment, data, select, forexValue])

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
        // @ts-ignore
        data["forexDetails"] = forexValue
        const manualCSOApproval: IManualDecision = {
            caseId: caseId,
            taskName: "cso-approval", // todo ...consider making these constants
            actionName: "cso-transfer-details-approval",
            resumeCase: true,
            nextSubStatus: "SenderDetailsCheckSuccessful",
            data: data,
            override: false
        }

        const rateExists = new ObjectHelpersFluent().testTitle("forex rate exists").selector(manualCSOApproval, "$.data.forexDetails.rate").isPresent().logValue().logTestResult().logTestMessage()
            .successCallBack(() => {
                console.log("succeeded...")
            })
            .failureCallBack(() => {
                console.log("failure...")
            })
            .logNewLineSpace()
            .getSummary().testResult

        const remittanceAmountExists = new ObjectHelpersFluent().testTitle("forex remittance amount exists").selector(manualCSOApproval, "$.data.forexDetails.remittanceAmount").isPresent().logValue().logTestResult().logTestMessage()
            .successCallBack(() => {
                console.log("succeeded...")
            }).failureCallBack(() => {
                console.log("failure...")
            }).logNewLineSpace().getSummary().testResult

        const forexTransferIsRequired = new ObjectHelpersFluent().testTitle("forex remittance amount exists").selector(manualCSOApproval, `$.data.${ConstantLabelsAndValues.csoValidationCheckList().get(1).name}`)
            .isPresent()
            .logValue().logTestResult().logTestMessage()
            .successCallBack(() => {
                console.log("succeeded...")
            }).failureCallBack(() => {
                console.log("failure...")
            }).logNewLineSpace()
            .getSummary().testResult

        const forexCheckAndValuesMatch = forexTransferIsRequired === remittanceAmountExists === rateExists

        const forexMatch = new ObjectHelpersFluent()
        forexMatch.testTitle("forex check meets its values (values exist if check is true)").directValue(forexCheckAndValuesMatch).isEqualTo(true).logValue().logTestResult().logTestMessage()
            .successCallBack(() => {
                console.log("succeeded...")
            })
            .failureCallBack(() => {
                Toast.warn(`Please set forex values OR uncheck ${ConstantLabelsAndValues.csoValidationCheckList().get(1).label}`)
            })
            .logNewLineSpace()
            .haltProcess(true, true, () => {

                console.log(".....", forexMatch.getSummary().testResult)
                if (!forexMatch.getSummary().testResult) {

                    setTimeout(() => {
                        Toast.warn("Not submitted")
                    }, 2000)


                }

            })

        const rejectionIsFalse = new ObjectHelpersFluent()
        rejectionIsFalse.testTitle("isRejected === false").selector(manualCSOApproval, "$.data.isRejected").isEqualTo(false).logValue().logTestResult().logTestMessage()
            .successCallBack(() => {
                console.log("succeeded...")
            })
            .failureCallBack(() => {
                console.log("failure...")
            })
            .logNewLineSpace()
            .haltProcess(true, true, () => {

                if (!rejectionIsFalse.getSummary().testResult) {
                    Toast.warn("Refresh the page and start over.SORRY")
                    setTimeout(() => {
                        Toast.warn("The submission is being considered a rejection")
                    }, 2000)

                }

            })

        console.log("losing:", manualCSOApproval)

        post(remoteRoutes.workflowsManual, manualCSOApproval, (resp: any) => {
                console.log(resp) // todo ... consider providing a message for both success and failure
            }, undefined,
            () => {
                window.location.href = window.location.origin
                dispatch(actionICheckKeyValue(ICheckKeyValueDefault))
            }
        )
    }

    const handleCSORejection = async () => {

        let checks = getChecksToPopulate(check.checks);
        let dropdownSelects = getDropdownSelectsToPopulate(select.selects)
        console.log("selectsss:", dropdownSelects)
        console.log("selectsss-2:", select)

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

        // @ts-ignore
        const comment = dropdownSelects[systemRoles.CSO]
        console.log("cso:", comment)

        if (comment === undefined || comment === null) {
            Toast.warn("Please select a remark (rejection reason)")
            return;
        }

        const manualCSORejection: IManualDecision = {
            caseId: caseId,
            taskName: "cso-approval", // todo ...consider making these constants
            actionName: "cso-transfer-details-approval",
            resumeCase: true,
            nextSubStatus: "SenderDetailsCheckSuccessful",
            data: {...checks, rejectionComment: comment},
            override: false
        }

        if (manualCSORejection.data.rejectionComment.trim().length > 0) {
            console.log("manual-cso-rejection:", manualCSORejection);

            // todo...uncomment
            // post(remoteRoutes.workflowsManual, manualCSORejection, (resp: any) => {
            //         console.log(resp) // todo ... consider providing a message for both success and failure
            //     }, undefined,
            //     () => {
            //
            //         // todo... place this after the the post (inside it)
            //         dispatch(actionISelectKeyValue(ISelectKeyValueDefault))
            //
            //         window.location.href = window.location.origin
            //
            //     }
            // )

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

    function showForexForm(e: React.ChangeEvent<HTMLInputElement>) {

        if (e.target.name === ConstantLabelsAndValues.csoValidationCheckList().get(1).name) {
            if (e.target.checked) {
                setShowForexDetailsForm(true)
            } else {
                setShowForexDetailsForm(false)
                const initialData: IForex = {
                    rate: '',
                    remittanceAmount: ''
                }
                // reset forex global state
                dispatch(actionIForexValue(initialData))
            }

        }

    }

    function handleDialogCancel() {
        setShowForexDetailsForm(false)
    }

    function handleSubmissionForexDetails() {

    }

    function showChecksFormOrChecksResults() {
        // console.log("loggin...:", workflow)
        let returned: {}

        // @ts-ignore
        if (workflow !== undefined && workflow !== null && (workflow.subStatus.includes("BM") || workflow.subStatus.includes("Fail")) && !isNewTransferRequestStarted) {
            // @ts-ignore
            returned = <VerificationsAlreadyDoneByCSO workflow={workflow}/>
        } else {
            returned = theCheckList.toArray().map((aCheck, index) => {
                return <Grid key={index} item sm={12}>
                    <CheckBoxTemplate value={aCheck.value} label={aCheck.label} name={aCheck.name} handleCheckChange={showForexForm}/>
                </Grid>
            })
        }
        return returned

    }

    const remarks: IRemarks = CSORejectionRemarks()

    return (

        <Grid container>
            {
                showChecksFormOrChecksResults()
            }

            <Grid item sm={12} className={classes.submissionGrid}>

                {
                    hasAnyRole(user, [systemRoles.CSO]) ?

                        <Box className={classes.submissionBox}>
                            <Button variant="contained" color="primary" onClick={handleCSOApproval}>SUBMIT
                                REQUEST</Button>

                            <Button variant="contained" className={classes.rejectButton}
                                    onClick={showCommentDialog}>REJECT</Button>

                        </Box>
                        :
                        ""
                }

            </Grid>


            {

                showCommentBox ? <EditDialog open={true}
                                             onClose={() => {
                                             }}
                                             title="Reject with a reason (select)"

                                             disableBackdropClick={false}

                                             children={<RejectionForm data={data} handleDialogCancel={cancelCommentDialog} handleSubmission={handleCSORejection}
                                                                      isCancelBtnDisabled={false}
                                                                      isSubmitBtnDisabled={isRejectBtnDisabled} remarks={remarks}/>}
                        // children={<Button>cam</Button>}
                    />

                    :
                    ""

            }

            {

                showForexDetailsForm ?
                    <EditDialog open={true} onClose={() => {
                    }}
                                title="Forex details" disableBackdropClick={false}

                                children={<ForexForm data={dataForexDetails} handleDialogCancel={handleDialogCancel} handleSubmission={handleSubmissionForexDetails}
                                                     isCancelBtnDisabled={false} isSubmitBtnDisabled={false}/>}

                    />
                    :
                    ""

            }

        </Grid>


    )
}

export default ValidationCheckList