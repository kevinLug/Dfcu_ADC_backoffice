import React, {useEffect, useState} from "react";
import {IList} from "../../../utils/collections/list";
import {IPropsChecks} from "./Check";
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

        const theCheckList = ConstantLabelsAndValues.bomChecksReviewConfirmation();

        for (let aCheck of theCheckList) {

            // const propertyName: string = aCheck.name.split("_")[0];
            aCheck.value = criteriaObj[aCheck.name]
        }

        return theCheckList

    }

    const isEven = (num: number) => num % 2 !== 0

    return <Grid>
        {

            checksReview().toArray().map((v, index) => {

                return <Grid key={index} style={{backgroundColor: isEven(index) ? 'white' : grey[50]}}>
                    {

                        ConstantLabelsAndValues.forexDetailsIgnored(v, checksReview(), 1) ?

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