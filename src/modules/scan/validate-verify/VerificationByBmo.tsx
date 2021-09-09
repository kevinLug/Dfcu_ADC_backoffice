// todo...to be cleaned up
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {IState} from "../../../data/types";
import Grid from "@material-ui/core/Grid";
import {actionICheckKeyValue, ICheckKeyValueState} from "../../../data/redux/checks/reducer";
import {IWorkflowResponseMessageState} from "../../../data/redux/workflow-response/reducer";
import {Dispatch} from "redux";
import {IList} from "../../../utils/collections/list";
import CheckBoxTemplate, {IPropsChecks} from "./Check";
import {getChecksToPopulate, getDropdownSelectsToPopulate} from "../populateLabelAndValue";
import {ActionStatus, IManualDecision, IWorkflow} from "../../workflows/types";
import {post} from "../../../utils/ajax";
import {ConstantLabelsAndValues, hasAnyRole, localRoutes, remoteRoutes, systemRoles} from "../../../data/constants";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import {createStyles, makeStyles} from "@material-ui/core";
import {Theme} from "@material-ui/core/styles";
import EditDialog from "../../../components/EditDialog";
import {Form, Formik} from "formik";
import {IDataProps} from "./CsoValidationChecklist";
import Toast from "../../../utils/Toast";
import RejectionRemarks from "./RejectionRemarks";
import {BMORejectionRemarks, IRemarks} from "./RejectionRemarksValues";
import {ISelectKeyValueState} from "../../../data/redux/selects/reducer";
import {ICheckKeyValueDefault} from "../../transfers/types";
import {addDynamicPropertyToObject, isNullOrEmpty, isNullOrUndefined} from "../../../utils/objectHelpers";
import grey from "@material-ui/core/colors/grey";
import SuccessFailureDisplay from "./SuccessFailureDisplay";
import ConfirmationDialog from "../confirmation-dialog";

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

const VerificationByBmo = ({workflow}: IPropsBMO) => {

    const classesRejection = useStylesRejection()
    const [isRejectBtnDisabled] = useState(false)

    const classes = useStylesInternal()
    const [theWorkflow] = useState(workflow)

    const criteriaBm = theWorkflow.tasks[2].actions[0].outputData


    const user = useSelector((state: IState) => state.core.user)
    const [showCommentBox, setShowCommentBox] = useState(false)

    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)
    const {check}: ICheckKeyValueState = useSelector((state: any) => state.checks)

    const {workflowResponseMessage}: IWorkflowResponseMessageState = useSelector((state: any) => state.workflowResponse)
    const [rejectionComment] = useState('')
    const {select}: ISelectKeyValueState = useSelector((state: any) => state.selects)

    const dispatch: Dispatch<any> = useDispatch();


    const initialData: IDataProps = {
        checks: check.checks,
        rejectionComment: rejectionComment
    }
    const [data] = useState(initialData)

    //todo...try to sieve by action name
    useEffect(() => {
        console.log(workflow.tasks[2].actions[1].status)
    }, [dispatch, check, workflow, rejectionComment, data])

    const checksReviewConfirmation = (): IList<IPropsChecks> => {
        const criteriaObj = JSON.parse(criteriaBm)

        const theCheckList = ConstantLabelsAndValues.bomChecksReviewConfirmation()

        if (criteriaObj !== null && criteriaObj !== undefined) {

            for (let aCheck of theCheckList) {

                const propertyName: string = aCheck.name;
                aCheck.value = criteriaObj[propertyName]

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

    const handleBomApproval = async () => {

        for (const v of ConstantLabelsAndValues.bomChecksReviewConfirmation()) {
            // @ts-ignore
            data[v.name] = getChecksToPopulate(check.checks)[v.name];
        }

        let caseId: string
        if (isNullOrEmpty(workflowResponseMessage.caseId) || workflowResponseMessage.caseId.includes("0000-0000")) {
            // @ts-ignore
            caseId = workflow.id
        } else {
            caseId = workflowResponseMessage.caseId
        }

        addDynamicPropertyToObject(data, 'isRejected', false)

        addDynamicPropertyToObject(data, 'approvedBy', user.name)

        addDynamicPropertyToObject(data, 'timestamp', new Date())

        delete data.checks

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
                window.location.href = `${localRoutes.applications}/${caseId}`
                dispatch(actionICheckKeyValue(ICheckKeyValueDefault))
            }
        )
    }

    const isEven = (num: number) => num % 2 !== 0

    function showResultBeingConfirmedByBom() {

        return ConstantLabelsAndValues.bomChecksReviewConfirmation().toArray().map((v, index) => {
            // @ts-ignore
            const value = getChecksToPopulate(check.checks)[v.name]
            v.value = value
            return <Grid key={index} style={{backgroundColor: isEven(index) ? 'white' : grey[50]}}>
                {

                    ConstantLabelsAndValues.forexDetailsIgnored(v, ConstantLabelsAndValues.bomChecksReviewConfirmation(), 1) ?

                        <SuccessFailureDisplay key={v.name} value={value} label={v.label} name={v.name} showSuperScript={false} showWarning={true}/>
                        :
                        <SuccessFailureDisplay value={value} label={v.label} name={v.name} key={v.name}/>

                }

            </Grid>
        })

    }

    function showConfirmationDialogApprovalBom() {

        if (isNullOrUndefined(workflow)) {
            Toast.warn('workflow is undefined')
            setTimeout(() => {
                Toast.warn('Reload page or try again')
            }, 2000)
            return
        }

        let caseId: string
        if (isNullOrEmpty(workflowResponseMessage.caseId) || workflowResponseMessage.caseId.includes("0000-0000")) {
            // @ts-ignore
            caseId = workflow.id
        } else {
            caseId = workflowResponseMessage.caseId
        }

        // @ts-ignore
        if (isNullOrEmpty(caseId) || isNullOrUndefined(caseId)) {
            Toast.warn('The case is not being picked or something is wrong ')
            setTimeout(() => {
                Toast.warn('Reload page or try again')
            }, 2000)

        } else
            setShowConfirmationDialog(true)

    }

    function cancelConfirmationDialogApproval() {
        setShowConfirmationDialog(false)
    }

    function handleConfirmBOMVerification() {
        return <ConfirmationDialog title="Confirm to approve or cancel" handleDialogCancel={cancelConfirmationDialogApproval} handleConfirmation={handleBomApproval}
                                   children={showResultBeingConfirmedByBom()}/>
    }

    async function handleBMORejection() {

        let data = {...getChecksToPopulate(check.checks)}

        let dropdownSelects = getDropdownSelectsToPopulate(select.selects)

        let caseId: string
        if (!workflowResponseMessage.caseId || workflowResponseMessage.caseId.includes("0000-0000")) {
            // @ts-ignore
            caseId = workflow.id
        } else {
            caseId = workflowResponseMessage.caseId
        }

        // @ts-ignore
        const comment = dropdownSelects[systemRoles.BOM]
        console.log("bmo:", comment)

        addDynamicPropertyToObject(data, 'isRejected', true)

        addDynamicPropertyToObject(data, 'approvedBy', user.name)

        const manualBMRejection: IManualDecision = {
            caseId: caseId,
            taskName: "bm-approval", // todo ...consider making these constants
            actionName: "bm-transfer-details-approval",
            resumeCase: true,
            nextSubStatus: "BMApprovalFailed",
            data: {...data, rejectionComment: comment},
            override: false
        }

        if (isNullOrEmpty(manualBMRejection.data.rejectionComment) || isNullOrUndefined(manualBMRejection.data.rejectionComment)) {
            Toast.warn("Please provide a rejection comment...");
            setTimeout(() => {
                Toast.warn("Not submitted...");
            }, 2000)
            return;
        }

        console.log("manual-bm:", manualBMRejection)

        post(remoteRoutes.workflowsManual, manualBMRejection, (resp: any) => {
                console.log(resp) // todo ... consider providing a message for both success and failure
            }, undefined,
            () => {

                //window.location.href = `${localRoutes.applications}/${caseId}`
                //dispatch(actionICheckKeyValue(ICheckKeyValueDefault))
                window.location.href = window.location.origin

            }
        )
    }

    const remarks: IRemarks = BMORejectionRemarks()

    return <Grid>

        {

            checksReviewConfirmation().toArray().map((val, index) => {

                return <Grid key={index} item sm={12}>
                    <CheckBoxTemplate value={val.value} label={val.label} name={val.name}/>

                </Grid>
            })
        }

        {

            // todo...user role will have to be BM
            hasAnyRole(user, [systemRoles.BM, systemRoles.BOM]) && workflow.tasks[2].actions[0].status !== ActionStatus.Done &&
            workflow.tasks[2].actions[0].status !== ActionStatus.Error ?
                <Grid item sm={12} className={classes.submissionGrid}>
                    <Box className={classes.submissionBox}>

                        <Button type="submit" variant="contained" color="primary" onClick={showConfirmationDialogApprovalBom}>Approve</Button>

                        <Button variant="contained" className={classes.rejectButton} onClick={showCommentDialog}>Reject</Button>

                    </Box>
                </Grid>
                :
                ""
        }

        {
            showConfirmationDialog ? handleConfirmBOMVerification() : ""
        }

        {
            showCommentBox ? <EditDialog open={true} onClose={() => {
                }} title="Reject with a reason (comment)" disableBackdropClick={false}>
                    <Grid item sm={12}>

                        <Formik

                            enableReinitialize

                            initialValues={data}
                            onSubmit={async function () {
                                await new Promise(resolve => {
                                    setTimeout(resolve, 500)

                                    handleBMORejection()

                                });

                            }}
                        >
                            <Form>

                                <RejectionRemarks remarks={remarks.remarks} role={remarks.role}/>

                                <Grid item sm={12} className={classesRejection.submissionGrid}>
                                    <Box className={classesRejection.submissionBox}>

                                        <Button type="submit" variant="contained" color="primary" disabled={isRejectBtnDisabled} onSubmit={handleBMORejection}>OK</Button>

                                        <Button variant="contained" className={classesRejection.rejectButton} onClick={cancelCommentDialog}>Cancel</Button>

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

export default VerificationByBmo