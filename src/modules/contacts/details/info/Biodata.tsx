import React, {useState} from 'react';
import {ContactCategory, IContact} from "../../types";
import DetailView, {IRec} from "../../../../components/DetailView";
import {printDate} from "../../../../utils/dateHelpers";
import PersonIcon from '@material-ui/icons/PermIdentity';
import EditIconButton from "../../../../components/EditIconButton";
import EditDialog from "../../../../components/EditDialog";
import PersonEditor from "../editors/PersonEditor";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import SectionTitle from "./SectionTitle";

interface IProps {
    data: IContact
}

export const idFields = (data: IContact): IRec[] => {
    if (data.category === ContactCategory.Person) {
        const {person} = data
        return [
            {
                label: 'BirthDay',
                value: printDate(person.dateOfBirth)
            },
            {
                label: 'Gender',
                value: person.gender
            },
            {
                label: 'Marital Status',
                value: person.civilStatus
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

const BioData = ({data}: IProps) => {
    const [dialog, setDialog] = useState(false)
    const {id = ''} = data

    const handleClick = () => {
        setDialog(true)
    }

    const handleClose = () => {
        setDialog(false)
    }
    const displayData = idFields(data);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <SectionTitle
                    title='Basic data'
                    editButton={<EditIconButton onClick={handleClick}/>}
                    icon={<PersonIcon fontSize='inherit'/>}
                />
                <Divider/>
            </Grid>
            <Grid item xs={12}>
                <Box p={1}>
                    <DetailView data={displayData} />
                </Box>
            </Grid>
            <EditDialog title='Edit Basic Data' open={dialog} onClose={handleClose}>
                <PersonEditor data={data.person} contactId={id} done={handleClose}/>
            </EditDialog>
        </Grid>
    );
}
export default BioData;
