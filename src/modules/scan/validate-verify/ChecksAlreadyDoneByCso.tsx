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

const VerificationsAlreadyDoneByCSO = ({workflow}: IProps) => {
    const [theWorkflow] = useState(workflow)
    const csoValidationResult = theWorkflow.tasks[1].actions[0].outputData

    useEffect(() => {
    }, [workflow, csoValidationResult])

    const checksReview = (): IList<IPropsChecks> => {

        const resultParsed = JSON.parse(csoValidationResult)

        let theCheckList = ConstantLabelsAndValues.csoCheckList()

        for (let aCheck of theCheckList) {

            const propertyName: string = aCheck.name.split("_")[0];
            aCheck.value = resultParsed[propertyName]

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

export default VerificationsAlreadyDoneByCSO