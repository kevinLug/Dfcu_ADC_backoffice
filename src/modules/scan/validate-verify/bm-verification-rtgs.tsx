import Grid from "@material-ui/core/Grid";
import ExpansionCard from "../../../components/ExpansionCard";
import SenderDetails from "./SenderDetails";
import BeneficiaryDetails from "./BeneficiaryDetails";
import TransferDetails from "./TransferDetails";

import React, {useEffect, useState} from "react";
import {IWorkflow, WorkflowSubStatus} from "../../workflows/types";
import {ICase, ICaseData} from "../../transfers/types";
import {IList, List} from "../../../utils/collections/list";
import {addCheck, IPropsChecks} from "./Check";
import {actionICaseState} from "../../../data/redux/transfers/reducer";
import {Dispatch} from "redux";
import {useDispatch, useSelector} from "react-redux";
import {useStyles} from "../ScanCrop";
import {IState} from "../../../data/types";
import {ErrorIcon, SuccessIcon} from "../../../components/xicons";
import Typography from "@material-ui/core/Typography";
import ValidationCheckList, {checkListCSO} from "./ValidationCheckList";
import ImageUtils from "../../../utils/imageUtils";

interface IProps {
    workflow: IWorkflow
}

interface IPropsBMO {
    workflow: IWorkflow
}

// todo...to be cleaned up
const VerificationByBMO = ({workflow}: IPropsBMO) => {

    const [theWorkflow] = useState(workflow)
    const criteria = theWorkflow.tasks[1].actions[0].outputData

    //todo...try to sieve by action name
    useEffect(() => {

    }, [workflow])

    const checksReview = (): IList<IPropsChecks> => {
        const criteriaObj = JSON.parse(criteria)

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

        }

        return theCheckList

    }


    return <Grid>
        {
            checksReview().toArray().map((v, index) => {
                return <Grid key={index}>
                    {

                        v.value ?
                            <Typography
                                variant='subtitle1'
                                style={{marginTop: 1}}>
                                &nbsp;
                                <SuccessIcon
                                    fontSize='inherit'
                                />
                                {v.label}
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
                            </Typography>
                    }

                </Grid>
            })
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

        console.log("journey: ", caseData.doc)
        // todo .. sprout this step (for re-usability)...also used in ScanCrop.tsx
        const arrayBuffer = ImageUtils.base64ToArrayBuffer(caseData.doc)
        // const arrayBuffer = new Buffer(caseData.doc)
        const blob = new Blob([arrayBuffer])
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = (event: any) => {
            const base64 = event.target.result
            setImageSrcFromBinary(base64)
        };

    }, [dispatch,workflow])

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