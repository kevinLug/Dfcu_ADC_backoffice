import React, {useEffect, useState} from "react";
import {IList, List} from "../../../utils/collections/list";
import {IPropsChecks} from "./Check";
import Grid from "@material-ui/core/Grid";
import SuccessFailureDisplay from "./success-failure-display";
import {IWorkflow} from "../../workflows/types";
import {ConstantLabelsAndValues} from "../../../data/constants";


interface IProps {
    workflow: IWorkflow
}

const VerificationsAlreadyDoneByCSO = ({workflow}: IProps) => {
    const [theWorkflow] = useState(workflow)
    const criteria = theWorkflow.tasks[1].actions[0].outputData

    //todo...try to sieve by action name
    useEffect(() => {
        console.log('testing: ', workflow.tasks[2].actions)
    }, [workflow, criteria])

    const checksReview = (): IList<IPropsChecks> => {
        const criteriaObj = JSON.parse(criteria)

        // console.log("criteria:", criteriaObj)
        // console.log("criteria-sub-status:", workflow.subStatus)

        let theCheckList = ConstantLabelsAndValues.csoCheckList()

        for (let aCheck of theCheckList) {

            const propertyName: string = aCheck.name.split("_")[0];
            aCheck.value = criteriaObj[propertyName]

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

export default VerificationsAlreadyDoneByCSO