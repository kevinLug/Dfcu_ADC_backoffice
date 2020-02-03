import React, {useState} from 'react';
import {ContactCategory, IContact} from "../../types";
import DetailView, {DetailViewX, IRec} from "../../../../components/DetailView";
import {printDate} from "../../../../utils/dateHelpers";
import PersonIcon from '@material-ui/icons/PermIdentity';
import EditIconButton from "../../../../components/EditIconButton";
import EditDialog from "../../../../components/EditDialog";
import PersonEditor from "../editors/PersonEditor";
import Grid from "@material-ui/core/Grid";
import SectionTitle from "./SectionTitle";

interface IProps {
    data: IContact
}

export const idFields = (data: IContact): IRec[] => {
    if (data.category === ContactCategory.Person) {
        const {person} = data
        return [
            {
                label: 'D.O.B',
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
        <Grid container spacing={0}>
            <Grid item xs={12}>
                <SectionTitle
                    title='Basic data'
                    editButton={<EditIconButton onClick={handleClick} style={{marginTop:5}}/>}
                    icon={<PersonIcon fontSize='small'/>}
                />
            </Grid>
            <Grid item xs={12} style={{paddingTop:0}}>
                <DetailViewX data={displayData}/>
            </Grid>
            <EditDialog title='Edit Basic Data' open={dialog} onClose={handleClose}>
                <PersonEditor data={data.person} contactId={id} done={handleClose}/>
            </EditDialog>
        </Grid>
    );
}
export default BioData;
