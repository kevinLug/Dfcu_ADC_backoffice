import React from 'react';
import {ActionStatus, IAction} from "../../types";
import RawData from "./RawData";
import Error from "./error";
import Pending from "./pending";
import Grid from "@material-ui/core/Grid";
import {printDateTime} from "../../../../utils/dateHelpers";
import DataLabel from "../../../../components/DataLabel";
import DataValue from "../../../../components/DataValue";
import {ContactCategory, renderName} from "../../../contacts/types";
import ContactLink from "../../../../components/links/ContactLink";

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


const hasError = (outData: string): boolean => {
    try {
        const data: IKycResponse = JSON.parse(outData);
        return !data.checkStatus
    } catch (e) {
        return true
    }
}

const KycCheck = ({action}: IProps) => {
    if (action.status === ActionStatus.Pending) {
        return <Pending text="Pending Execution"/>
    }
    const dataString = action.outputData
    if (action.status === ActionStatus.Error && hasError(dataString)) {
        return <Error action={action}/>
    }

    const data: IKycResponse = JSON.parse(dataString);
    const contact: any = JSON.parse(action.inputData);
    contact.category = ContactCategory.Person
    const fields = [
        {
            label: 'Name',
            value: <ContactLink id={contact.id} name={renderName(contact)}/>
        },
        {
            label: 'Check Type',
            value: data.checkType
        },
        {
            label: 'Check Status',
            value: `${data.checkStatus}/${data.value}`
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
                        <DataLabel>
                            {it.label}
                        </DataLabel>
                        <DataValue>{it.value}</DataValue>
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
