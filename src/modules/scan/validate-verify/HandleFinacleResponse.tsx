import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import React, {useEffect} from "react";
import {ICaseState} from "../../../data/redux/transfers/reducer";
import {useSelector} from "react-redux";
import {IWorkflowState} from "../../../data/redux/workflows/reducer";
import DataLabel from "../../../components/DataLabel";
import DataValue from "../../../components/DataValue";

interface IFinacleResponse {
    finacleResponse: any
}

interface IFinacleErrorResponse {

}

const HandleFinacleResponse = () => {
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

    return  <Grid container>
        <Box>
            <Typography>Finacle Response Message:</Typography>
            <Divider />
            {displayResponse()}
        </Box>
    </Grid>
}

export default HandleFinacleResponse

