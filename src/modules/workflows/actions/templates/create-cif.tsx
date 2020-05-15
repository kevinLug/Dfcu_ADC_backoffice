import React from 'react';
import {ActionStatus, IAction} from "../../types";
import Error from "./error";
import Pending from "./pending";
import Grid from "@material-ui/core/Grid";
import {printDateTime} from "../../../../utils/dateHelpers";
import DataValue from "../../../../components/DataValue";
import {ContactCategory, renderName, toTitleCase} from "../../../contacts/types";
import ContactLink from "../../../../components/links/ContactLink";
import {DateIcon, SuccessIcon} from "../../../../components/xicons";
import IconLabel from "../../../../components/IconLabel";
import {hasValue} from "../../../../components/inputs/inputHelpers";
import {Typography} from "@material-ui/core";

interface IProps {
    action: IAction
}


interface ICifResponse {
    id: string
    type: string
    cifId: string
    dupResponse: any
    message?: string
}


const hasError = (outData: string): boolean => {
    try {
        const data: ICifResponse = JSON.parse(outData);
        return !hasValue(data.cifId)
    } catch (e) {
        return true
    }
}

const CreateCif = ({action}: IProps) => {
    if (action.status === ActionStatus.Pending) {
        return <Pending text="Pending Execution"/>
    }
    const dataString = action.outputData
    if (action.status === ActionStatus.Error && hasError(dataString)) {
        return <Error action={action}/>
    }
    const data: ICifResponse = JSON.parse(dataString);
    const {contact}: any = JSON.parse(action.inputData);
    contact.category = ContactCategory.Person
    return (
        <Grid container>
            <Grid item xs={12} sm={6} md={4}>
                <DataValue><ContactLink id={contact.id} name={toTitleCase(renderName(contact))}/></DataValue>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <IconLabel icon={
                    <SuccessIcon fontSize='inherit'/>
                } label={<div>{data.cifId}&nbsp;<Typography variant='caption'>({data.type})</Typography></div>}/>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <IconLabel icon={<DateIcon fontSize='inherit'/>} label={printDateTime(action.runDate)}/>
            </Grid>
        </Grid>
    );
}


export default CreateCif;
