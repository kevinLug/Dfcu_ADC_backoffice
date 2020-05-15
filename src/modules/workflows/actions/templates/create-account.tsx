import React from 'react';
import Grid from "@material-ui/core/Grid";
import {ActionStatus, IAction} from "../../types";
import Error from "./error";
import Pending from "./pending";
import Typography from "@material-ui/core/Typography";
import DataValue from "../../../../components/DataValue";
import IconLabel from "../../../../components/IconLabel";
import {DateIcon, SuccessIcon} from "../../../../components/xicons";
import {printDateTime} from "../../../../utils/dateHelpers";

interface IProps {
    action: IAction
}

interface IAccount {
    cifId: string,
    accountNumber: string,
}

const CreateAccount = ({action}: IProps) => {
    if (action.status === ActionStatus.Error) {
        return <Error action={action}/>
    }
    if (action.status === ActionStatus.Pending) {
        return <Pending text="Pending Execution"/>
    }
    const dataString = action.outputData
    const data: IAccount = JSON.parse(dataString);
    const request: any = JSON.parse(action.inputData);
    return (
        <Grid container>
            <Grid item xs={12} sm={6} md={4}>
                <DataValue>{request.acctName}&nbsp;<Typography variant='caption'>(Account Name)</Typography></DataValue>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <IconLabel icon={
                    <SuccessIcon fontSize='inherit'/>
                } label={data.accountNumber}/>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <IconLabel icon={<DateIcon fontSize='inherit'/>} label={printDateTime(action.runDate)}/>
            </Grid>
        </Grid>
    );
}

export default CreateAccount;
