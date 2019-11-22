import React from 'react';
import Grid from "@material-ui/core/Grid";
import {ActionStatus, IAction} from "../../types";
import Error from "./error";
import Pending from "./pending";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import DetailView, {IRec} from "../../../../components/DetailView";
import RawData from "./RawData";

interface IProps {
    action: IAction
}

interface IAccount {
    cifId: string,
    accountNumber: string,
    accountRequest: {
        schemeCode: string,
        glSubHeadCode: string,
        accountStatement: string,
    }
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
    const fields: IRec[] = [
        {
            label: 'CIF Number',
            value: data.cifId
        },
        {
            label: 'Account Number',
            value: data.accountNumber
        },
        {
            label: 'Scheme Code',
            value: data.accountRequest.schemeCode
        },
        {
            label: 'Credit Grading',
            value: 'Defaulted to A9'
        },
        {
            label: 'ATM Requested',
            value: request.metaData.requestAtmCard ? 'Yes' : 'No'
        }
    ]
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography>Account Details</Typography>
                <Divider/>
                <DetailView data={fields} columns={2}/>
            </Grid>
            <Grid item xs={12}>
                <RawData action={action}/>
            </Grid>
        </Grid>
    );
}

export default CreateAccount;
