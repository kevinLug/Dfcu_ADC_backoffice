import Grid from "@material-ui/core/Grid";

import React, {useEffect} from "react";

import {useSelector} from "react-redux";
import {IWorkflowState} from "../../../data/redux/workflows/reducer";
import DataLabel from "../../../components/DataLabel";
import DataValue from "../../../components/DataValue";
import ExpansionCard from "../../../components/ExpansionCard";
import {createStyles, makeStyles, Theme} from "@material-ui/core";

export const useStylesHandleFinacleResponseTransfer = makeStyles((theme: Theme) =>
    createStyles({

        root: {
            flexGrow: 1,
        },
        expansion: {
            padding: 5,
        }

    })
);

interface IFinacleResponse {
    finacleResponse: any
}

interface IFinacleErrorResponse {

}

const HandleFinacleResponse = () => {

    const classes = useStylesHandleFinacleResponseTransfer();

    const {workflow}: IWorkflowState = useSelector((state: any) => state.workflows)

    useEffect(() => {
        // console.log(`applicantDetails:`, applicantDetails)
    }, [workflow])

    function displayResponse(){
        if (!workflow){
            return ''
        }
        // @ts-ignore
        const data = workflow.tasks[3].actions[1].outputData
        const dataParsed = JSON.parse(data)
        console.log('data;;;;', data)
        console.log('data;;;;', dataParsed, dataParsed["Message"])
        // return dataParsed["Message"]

        console.log('transferOrderId',dataParsed["transferOrderId"])

        if (!data){
            return ''
        }

        if (!dataParsed["transferOrderId"]){
            return  <Grid container item spacing={4} sm={12}>
                <Grid item sm={5}>
                    <DataLabel noColon={true}>Message: </DataLabel>
                </Grid>
                <Grid item sm={7}>
                    <DataValue>{dataParsed["Message"]}</DataValue>
                </Grid>
            </Grid>
        }

        return  <Grid container item spacing={4} sm={12}>

            <Grid item sm={5}>
                <DataLabel noColon={true}>Message: </DataLabel>
            </Grid>
            <Grid item sm={7}>
                <DataValue>{dataParsed["message"]}</DataValue>
            </Grid>

            <Grid item sm={5}>
                <DataLabel noColon={true}>Finacle transfer Reference: </DataLabel>
            </Grid>
            <Grid item sm={7}>
                <DataValue>{dataParsed["transferOrderId"]}</DataValue>
            </Grid>

        </Grid>
    }

    return <Grid item sm={12}>

                <Grid className={classes.expansion}>
                    <ExpansionCard title="Finacle Response" children={displayResponse()}/>
                </Grid>

    </Grid>
}

export default HandleFinacleResponse

