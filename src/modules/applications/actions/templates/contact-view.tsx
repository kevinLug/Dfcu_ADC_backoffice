import React from 'react';
import {Grid} from "@material-ui/core";
import {idFields} from "../../../contacts/details/IdInfo";
import {ActionStatus, IAction} from "../../types";
import Error from "./error";
import Pending from "./pending";
import {IContact} from "../../../contacts/types";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import DetailView from "../../../../components/DetailView";

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
            <Grid item xs={12} >
                <Grid item xs={12}>
                    <Typography>Identification</Typography>
                    <Divider/>
                    <DetailView data={idFields(data)} columns={2}/>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default ContactView;
