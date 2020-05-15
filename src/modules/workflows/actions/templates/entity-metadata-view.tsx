import React from 'react';
import Grid from "@material-ui/core/Grid";
import {ActionStatus, IAction} from "../../types";
import Error from "./error";
import Pending from "./pending";
import DetailView, {IRec} from "../../../../components/DetailView";
import PhoneLink from "../../../../components/links/PhoneLink";

interface IEntityAccountDetails {
    accountName: string,
    contactPersonName: string,
    contactPersonPhone: string,
    currency: string,
    product: string,
}

const fields = (data: IEntityAccountDetails): IRec[] => {
    return [
        {
            label: 'Account name',
            value: data.accountName
        },
        {
            label: 'Currency',
            value: data.currency
        },
        {
            label: 'Contact Person',
            value: data.contactPersonName
        },
        {
            label: 'Contact Phone',
            value: <PhoneLink  value={data.contactPersonPhone}/>
        }
    ]
}


interface IProps {
    action: IAction
}

const EntityMetadataView = ({action}: IProps) => {
    if (action.status === ActionStatus.Error) {
        return <Error action={action}/>
    }
    if (action.status === ActionStatus.Pending) {
        return <Pending text="Pending Execution"/>
    }
    const dataString = action.outputData
    const data: IEntityAccountDetails = JSON.parse(dataString);
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} >
                <Grid item xs={12}>
                    <DetailView data={fields(data)} columns={2}/>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default EntityMetadataView;
