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
import {getChecksToPopulate, getDropdownSelectsToPopulate} from "../populateLabelAndValue";
import {ActionStatus, IManualDecision, IWorkflow, WorkflowSubStatus} from "../../workflows/types";
import {post} from "../../../utils/ajax";
import {ConstantLabelsAndValues, hasAnyRole, remoteRoutes, systemRoles} from "../../../data/constants";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import {createStyles, makeStyles, TextareaAutosize} from "@material-ui/core";
import {Theme} from "@material-ui/core/styles";
import EditDialog from "../../../components/EditDialog";
import {Form, Formik} from "formik";
import {IDataProps} from "./ValidationCheckList";
import Toast from "../../../utils/Toast";
import RejectionRemarks from "./rejection-remarks";
import {BMORejectionRemarks, CSORejectionRemarks, IRemarks} from "./rejection-remarks-values";
import {ISelectKeyValueState} from "../../../data/redux/selects/reducer";

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

// interface IRemarks {
//     reason: string;
//     requestStatus: string;
// }

// function addRemarkToList(list: IList<IRemarks>, reason: string, requestStatus: string) {
//     const aRemark: IRemarks = {
//         reason,
//         requestStatus
//     }
//     list.add(aRemark);
// }

// function bMORemarks() {
//
//     const remarks: IList<IRemarks> = new List();
//
//     addRemarkToList(remarks, "Instruction is not signed as per mandate", "Rejected");
//
//     addRemarkToList(remarks, "Sender's account number is invalid", "Rejected");
//
//     addRemarkToList(remarks, "Sender has insufficient funds", "Rejected");
//
//     addRemarkToList(remarks, "Recipient's details are incomplete", "Rejected");
//
//     addRemarkToList(remarks, "Forex details are incorrect", "Rejected");
//
//     return remarks
//
// }

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
    const {select}: ISelectKeyValueState = useSelector((state: any) => state.selects)

    const dispatch: Dispatch<any> = useDispatch();
    // const [remarks] = useState(bMORemarks())

    const initialData: IDataProps = {
        checks: check.checks,
        rejectionComment: rejectionComment
    }
    const [data, setData] = useState(initialData)

    //todo...try to sieve by action name
    useEffect(() => {
        console.log(workflow.tasks[2].actions[0].status)
    }, [dispatch, check, workflow, rejectionComment, data])

    const checksReviewConfirmation = (): IList<IPropsChecks> => {
        const criteriaObj = JSON.parse(criteriaBm)

        const theCheckList = ConstantLabelsAndValues.bomChecksReviewConfirmation()

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
        const comment = dropdownSelects[systemRoles.BOM]
        console.log("bmo:", comment)

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
            data: {...data, rejectionComment: comment},
            override: false
        }

        console.log("manual-time:", manualBMRejection)

        if (manualBMRejection.data.rejectionComment.trim().length === 0) {
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

                window.location.href = window.location.origin
            }
        )
    }

    const remarks: IRemarks = BMORejectionRemarks()

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

        {

            // todo...user role will have to be BM
            hasAnyRole(user, [systemRoles.BM, systemRoles.BOM]) && workflow.tasks[2].actions[0].status !== ActionStatus.Done && workflow.tasks[2].actions[0].status !== ActionStatus.Error ?
                <Grid item sm={12} className={classes.submissionGrid}>
                    <Box className={classes.submissionBox}>

                        <Button type="submit" variant="contained" color="primary"
                            // disabled={isRejectBtnDisabled}
                                onClick={handleBMApproval}
                        >Approve</Button>

                        <Button variant="contained" className={classes.rejectButton}
                                onClick={showCommentDialog}>Reject</Button>

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

                                <RejectionRemarks remarks={remarks.remarks} role={remarks.role}/>

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