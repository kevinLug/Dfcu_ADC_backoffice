import React from 'react';
import Grid from "@material-ui/core/Grid";
import {ActionStatus, IAction} from "../../types";
import Error from "./error";
import Pending from "./pending";
import {ContactCategory, getNin, getPhone, IContact, renderName} from "../../../contacts/types";
import DetailView, {IRec} from "../../../../components/DetailView";
import {printDate} from "../../../../utils/dateHelpers";
import ContactLink from "../../../../components/links/ContactLink";


const fields = (data: IContact): IRec[] => {
    if (data.category === ContactCategory.Person) {
        const {person} = data
        return [
            {
                label: 'Name',
                value: <ContactLink id={data.id} name={renderName(data)}/>
            },
            {
                label: 'Phone',
                value: getPhone(data)
            },
            {
                label: 'D.O.B',
                value: printDate(person.dateOfBirth)
            },
            {
                label: 'NIN',
                value: getNin(data)
            }
        ]
    } else {
        const {company} = data
        return [
            {
                label: 'Category',
                value: printDate(company.category)
            },
            {
                label: 'Employees',
                value: company.numberOfEmployees
            }
        ]
    }
}


interface IProps {
    action: IAction
}

const ContactView = ({action}: IProps) => {
    if (action.status === ActionStatus.Error) {
        return <Error action={action}/>
    }
    if (action.status === ActionStatus.Pending) {
        return <Pending text="Pending Execution"/>
    }
    const dataString = action.outputData
    const data: IContact = JSON.parse(dataString);
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

export default ContactView;
