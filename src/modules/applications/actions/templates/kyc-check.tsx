import React from 'react';
import {Typography} from "@material-ui/core";
import {ActionStatus, IAction} from "../../types";
import RawData from "./RawData";
import Error from "./error";
import Pending from "./pending";
import Grid from "@material-ui/core/Grid";
import {printDateTime} from "../../../../utils/dateHelpers";

interface IProps {
    action: IAction
}

interface IKycResponse {
    id: string
    referenceId: string
    checkType: string
    checkStatus: string
    value?: string
    comment?: string
    data: any
    runDate?: string
}

const KycCheck = ({action}: IProps) => {
    if (action.status === ActionStatus.Error) {
        return <Error text={action.statusMessage}/>
    }
    if (action.status === ActionStatus.Pending) {
        return <Pending text="Pending Execution"/>
    }
    const dataString = action.outputData
    const data: IKycResponse = JSON.parse(dataString);
    const fields = [
        {
            label: 'Check Type',
            value: data.checkType
        },
        {
            label: 'Check Status',
            value: data.checkStatus
        },
        {
            label: 'Value',
            value: data.value
        },
        {
            label: 'Date',
            value: printDateTime(data.runDate)
        }
    ]
    return (
        <Grid container>
            {
                fields.map(it => (
                    <Grid item xs={12} sm={6} md={3} key={it.label}>
                        <Typography variant='caption'>
                            <b>{it.label}</b>
                        </Typography>
                        <Typography>{it.value}</Typography>
                    </Grid>
                ))
            }
            <Grid item xs={12}>
                <RawData action={action}/>
            </Grid>
        </Grid>
    );
}


export default KycCheck;
