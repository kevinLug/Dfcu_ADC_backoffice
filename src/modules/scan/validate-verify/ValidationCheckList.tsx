import React, {useEffect} from "react";
import Grid from "@material-ui/core/Grid";
import {addCheck, IPropsChecks} from "./Check";
import CheckBoxTemplate from "./Check";
import {IList, List} from "../../../utils/collections/list";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import {createStyles, makeStyles} from "@material-ui/core";
import {IWorkflowResponseMessageState} from "../../../data/redux/workflow-response/reducer";
import {useDispatch, useSelector} from "react-redux";

import {ICheckKeyValueState} from "../../../data/redux/checks/reducer";

import {IManualDecision} from "../../workflows/types";

import {remoteRoutes} from "../../../data/constants";

import {post} from "../../../utils/ajax";
import {getChecksToPopulate} from "../populateLabelAndValue";
import {IWorkflowState} from "../../../data/redux/workflows/reducer";
import {Dispatch} from "redux";

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

export const checkListCSO = (): IList<IPropsChecks> => {

    const theCheckList = new List<IPropsChecks>();
    theCheckList.add(addCheck("Transfer request is signed as per account mandate", "isTransferSignedAsPerAccountMandate"))
    theCheckList.add(addCheck("Transfer requires forex", "transferRequiresForex"))
    theCheckList.add(addCheck("Sender's account number is correct", "isSenderAccountNumberCorrect"))
    theCheckList.add(addCheck("Sender has sufficient funds", "senderHasSufficientFunds"))
    theCheckList.add(addCheck("Recipient's bank details are complete", "isRecipientBankDetailsComplete"))
    theCheckList.add(addCheck("Recipient's physical address is complete (TTs)", "isRecipientPhysicalAddressComplete"))

    return theCheckList;
}

const ValidationCheckList = ({theCheckList}:IProps) => {

    const classes = useStyles()
    const {workflowResponseMessage}: IWorkflowResponseMessageState = useSelector((state: any) => state.workflowResponse)

    const {check}: ICheckKeyValueState = useSelector((state: any) => state.checks)
    const {workflow}: IWorkflowState = useSelector((state: any) => state.workflows)

    const dispatch: Dispatch<any> = useDispatch();

    useEffect(() => {
        // console.log(check.checks)
    }, [dispatch,check,workflow])

    const handleCSOApproval = async () => {

        let data = getChecksToPopulate(check.checks);
        let caseId: string
        if (!workflowResponseMessage.caseId || workflowResponseMessage.caseId.includes("0000-0000") ){
            // @ts-ignore
            caseId = workflow.id
        }else {
            caseId = workflowResponseMessage.caseId
        }

        const manualCSOApproval: IManualDecision = {
            caseId: caseId,
            taskName: "cso-approval", // todo ...consider making these constants
            actionName: "cso-transfer-details-approval",
            resumeCase: true,
            nextSubStatus: "SenderDetailsCheckSuccessful",
            data: data,
            override: false
        }

        post(remoteRoutes.workflowsManual, manualCSOApproval, (resp: any) => {
                console.log(resp) // todo ... consider providing a message for but success and failure
            }, undefined,
            () => {
                window.location.href = window.location.origin
            }
        )
    }

    return (

        <Grid container>
            {
                theCheckList.toArray().map((aCheck, index) => {

                    return <Grid key={index} item sm={12}>
                        <CheckBoxTemplate value={aCheck.value} label={aCheck.label} name={aCheck.name}/>
                    </Grid>
                })
            }

            <Grid item sm={12} className={classes.submissionGrid}>
                <Box className={classes.submissionBox}>
                    <Button variant="contained" className={classes.rejectButton}>REJECT</Button>
                    <Button variant="contained" color="primary" onClick={handleCSOApproval}>SUBMIT REQUEST</Button>
                </Box>
            </Grid>

        </Grid>

    )
}

export default ValidationCheckList