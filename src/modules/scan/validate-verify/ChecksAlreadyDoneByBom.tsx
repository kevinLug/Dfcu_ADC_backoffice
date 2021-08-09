import React, {useEffect, useState} from "react";
import {IList, List} from "../../../utils/collections/list";
import {addCheck, IPropsChecks} from "./Check";
import Grid from "@material-ui/core/Grid";
import SuccessFailureDisplay from "./SuccessFailureDisplay";
import {IWorkflow} from "../../workflows/types";
import {ConstantLabelsAndValues} from "../../../data/constants";
import grey from "@material-ui/core/colors/grey";


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

    const isEven = (num: number) => num % 2 !== 0

    return <Grid>
        {

            checksReview().toArray().map((v, index) => {
                return <Grid key={index} style={{backgroundColor: isEven(index) ? 'white' : grey[50]}}>
                    {

                        workflow.type !== ConstantLabelsAndValues.CASE_VALIDATION_SWIFT && v.label === ConstantLabelsAndValues.bomChecksReviewConfirmation().get(1).label && !v.value ?

                            <SuccessFailureDisplay key={v.name} value={v.value} label={v.label} name={v.name} showSuperScript={false} showWarning={true}/>
                            :
                            <SuccessFailureDisplay value={v.value} label={v.label} name={v.name} key={v.name}/>

                    }

                </Grid>
            })

        }
    </Grid>
}

export default VerificationsAlreadyDoneByBM