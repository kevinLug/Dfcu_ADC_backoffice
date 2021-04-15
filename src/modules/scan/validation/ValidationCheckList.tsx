import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {initialChecks, IPropsChecks} from "./Check";
import CheckBoxTemplate from "./Check";
import {IList, List} from "../../../utils/collections/list";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import {createStyles, makeStyles} from "@material-ui/core";
import {IWorkflowResponseMessageState} from "../../../data/redux/workflow-response/reducer";
import {useDispatch, useSelector} from "react-redux";

import {ICheckKeyValueState} from "../../../data/redux/checks/reducer";
import {Dispatch} from "redux";
import {IManualDecision} from "../../workflows/types";
import * as superagent from "superagent";
import {remoteRoutes} from "../../../data/constants";
import Toast from "../../../utils/Toast";
import {login} from "../../../api-stress/login";
import {post} from "../../../utils/ajax";

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

const ValidationCheckList = () => {

    const classes = useStyles()
    const {workflowResponseMessage}: IWorkflowResponseMessageState = useSelector((state: any) => state.workflowResponse)
    const [data] = useState()
    const {check}: ICheckKeyValueState = useSelector((state: any) => state.checks)

    useEffect(() => {
        console.log(check.checks)
    }, [check, data])

    const handleCSOApproval = async () => {

        // todo... consider sprouting this elsewhere for re-use
        let data = {}
        check.checks.keyValueMapToArray().forEach(v => {
            console.log(v)
            // @ts-ignore
            data[v.key] = v.value
        })

        const manualCSOApproval: IManualDecision = {
            caseId: workflowResponseMessage.caseId,
            taskName: "cso-approval", // todo ...consider making these constants
            actionName: "cso-transfer-details-approval",
            resumeCase: true,
            nextSubStatus: "SenderDetailsCheckSuccessful",
            data: data,
            override: false
        }

        post(remoteRoutes.workflowsManual,manualCSOApproval,(resp:any) => {
            console.log(resp) // todo ... consider providing a message for but success and failure
            },undefined,
            () => {

            }
        )


    }

    const addCheck = (label: string, name: string, value: boolean = false) => {
        const theCheckObject: IPropsChecks = {
            label: label,
            name: name,
            value: value
        }
        return theCheckObject;
    }

    const checkList = (): IList<IPropsChecks> => {

        const theCheckList = new List<IPropsChecks>();
        theCheckList.add(addCheck("Transfer request is signed as per account mandate", "isTransferSignedAsPerAccountMandate", true))
        theCheckList.add(addCheck("Transfer requires forex", "transferRequiresForex", true))
        theCheckList.add(addCheck("Sender's account number is correct", "isSenderAccountNumberCorrect"))
        theCheckList.add(addCheck("Sender has sufficient funds", "senderHasSufficientFunds"))
        theCheckList.add(addCheck("Recipient's bank details are complete", "isRecipientBankDetailsComplete"))
        theCheckList.add(addCheck("Recipient's physical address is complete (TTs)", "isRecipientPhysicalAddressComplete"))

        console.log(theCheckList)

        return theCheckList;
    }

    return (

        <Grid container>
            {
                checkList().toArray().map((aCheck, index) => {
                    console.log(aCheck.value)
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