import React, {useEffect, useState} from "react";
import {IList, List} from "../../../utils/collections/list";
import {addCheck, IPropsChecks} from "./Check";
import Grid from "@material-ui/core/Grid";
import SuccessFailureDisplay from "./success-failure-display";
import {IWorkflow} from "../../workflows/types";
import {ConstantLabelsAndValues} from "../../../data/constants";


interface IProps {
    workflow: IWorkflow
}

const VerificationsAlreadyDoneByBM = ({workflow}: IProps) => {
    const [theWorkflow] = useState(workflow)
    const criteria = theWorkflow.tasks[2].actions[0].outputData

    //todo...try to sieve by action name
    useEffect(() => {
        console.log('testing-by-bm: ', workflow.tasks[2].actions[0].outputData)
    }, [workflow, criteria])

    const checksReview = (): IList<IPropsChecks> => {
        const criteriaObj = JSON.parse(criteria)

        console.log("criteria:", criteriaObj)
        console.log("criteria-sub-status:", workflow.subStatus)

        const theCheckList = ConstantLabelsAndValues.bomChecksReviewConfirmation();
        // theCheckList.add(addCheck("Transfer request is signed as per account mandate", "isTransferSignedAsPerAccountMandate_Bm_Confirmation"))
        // theCheckList.add(addCheck("Transfer requires forex", "transferRequiresForex_Bm_Confirmation"))
        // theCheckList.add(addCheck("Sender's account number is correct", "isSenderAccountNumberCorrect_Bm_Confirmation"))
        // theCheckList.add(addCheck("Sender has sufficient funds", "senderHasSufficientFunds_Bm_Confirmation"))
        // theCheckList.add(addCheck("Recipient's bank details are complete", "isRecipientBankDetailsComplete_Bm_Confirmation"))
        // theCheckList.add(addCheck("Recipient's physical address is complete (TTs)", "isRecipientPhysicalAddressComplete_Bm_Confirmation"))

        for (let aCheck of theCheckList) {

            const propertyName: string = aCheck.name.split("_")[0];
            aCheck.value = criteriaObj[aCheck.name]
            // aCheck.value = criteriaObj[propertyName]
            // console.log("aCheck:", aCheck)
        }

        return theCheckList

    }

    return <Grid>
        {

            checksReview().toArray().map((v, index) => {
                return <Grid key={index} style={index % 2 ? {background: "#fcf6ea"} : {background: "#fdf9f1"}}>
                    {

                        <SuccessFailureDisplay value={v.value} label={v.label} name={v.name} key={v.name}/>

                    }

                </Grid>
            })

        }
    </Grid>
}

export default VerificationsAlreadyDoneByBM