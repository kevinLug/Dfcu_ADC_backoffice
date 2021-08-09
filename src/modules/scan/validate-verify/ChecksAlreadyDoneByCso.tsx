import React, {useEffect, useState} from "react";
import {IList, List} from "../../../utils/collections/list";
import {IPropsChecks} from "./Check";
import Grid from "@material-ui/core/Grid";
import SuccessFailureDisplay from "./SuccessFailureDisplay";
import {IWorkflow} from "../../workflows/types";
import {ConstantLabelsAndValues} from "../../../data/constants";
import grey from "@material-ui/core/colors/grey";


interface IProps {
    workflow: IWorkflow
}

const VerificationsAlreadyDoneByCSO = ({workflow}: IProps) => {
    const [theWorkflow] = useState(workflow)
    const criteria = theWorkflow.tasks[1].actions[0].outputData

    useEffect(() => {
    }, [workflow, criteria])

    const checksReview = (): IList<IPropsChecks> => {

        const criteriaObj = JSON.parse(criteria)

        let theCheckList = ConstantLabelsAndValues.csoCheckList()

        for (let aCheck of theCheckList) {

            const propertyName: string = aCheck.name.split("_")[0];
            aCheck.value = criteriaObj[propertyName]

        }

        return theCheckList

    }

    const isEven = (num: number) => num % 2 !== 0

    return <Grid>
        {

            checksReview().toArray().map((v, index) => {
                return <Grid key={index} style={{backgroundColor: isEven(index) ? 'white' : grey[50]}}>
                    {

                        workflow.type !== ConstantLabelsAndValues.CASE_VALIDATION_SWIFT && v.label === ConstantLabelsAndValues.csoCheckList().get(1).label && !v.value ?

                            <SuccessFailureDisplay key={v.name} value={v.value} label={v.label} name={v.name} showSuperScript={false} showWarning={true}/>
                            :
                            <SuccessFailureDisplay value={v.value} label={v.label} name={v.name} key={v.name}/>

                    }

                </Grid>
            })

        }
    </Grid>
}

export default VerificationsAlreadyDoneByCSO