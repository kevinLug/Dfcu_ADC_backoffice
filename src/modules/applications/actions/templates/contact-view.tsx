import React from 'react';
import {Grid} from "@material-ui/core";
import IdInfo from "../../../contacts/details/IdInfo";
import {ActionStatus, IAction} from "../../types";
import Phones from "../../../contacts/details/Phones";
import Error from "./error";
import Pending from "./pending";
import {IContact} from "../../../contacts/types";

interface IProps {
    action: IAction
}

const ContactView = ({action}: IProps) => {
    if (action.status === ActionStatus.Error) {
        return <Error text={action.statusMessage}/>
    }
    if (action.status === ActionStatus.Pending) {
        return <Pending text="Pending Execution"/>
    }
    const dataString = action.outputData
    const data: IContact = JSON.parse(dataString);
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <IdInfo data={data}/>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Phones data={data}/>
            </Grid>
        </Grid>
    );
}

export default ContactView;
