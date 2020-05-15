import React, {useState} from 'react';
import MailIcon from '@material-ui/icons/Mail';
import {IContact, IEmail} from "../../types";
import EmailEditor from "../editors/EmailEditor";
import EditIconButton, {AddIconButton, DeleteIconButton} from "../../../../components/EditIconButton";
import EditDialog from "../../../../components/EditDialog";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import {trimString} from "../../../../utils/stringHelpers";
import SectionTitle from "./SectionTitle";
import SectionItem from "./SectionItem";

interface IProps {
    data: IContact
}
const Emails = (props: IProps) => {
    const [selected, setSelected] = useState<IEmail | null>(null)
    const [dialog, setDialog] = useState(false)
    const {emails, id = ''} = props.data

    const handleClick = (email: IEmail) => () => {
        setSelected(email)
        setDialog(true)
    }

    const handleDelete = (email: IEmail) => () => {
        //TODO
    }

    const handleClose = () => {
        setDialog(false)
        setSelected(null)
    }

    const handleNew = () => {
        setSelected(null)
        setDialog(true)
    }


    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <SectionTitle
                    title='Emails'
                    editButton={<AddIconButton onClick={handleNew}/>}
                    icon={ <MailIcon fontSize='inherit'/>}
                />
                <Divider/>
            </Grid>
            {emails.map(it => (
                <Grid item xs={12} key={it.id}>
                    <SectionItem buttons={
                        <Box>
                            <EditIconButton onClick={handleClick(it)}/>
                            <DeleteIconButton onClick={handleDelete(it)}/>
                        </Box>
                    }>
                        <Box flexGrow={1}>
                            <Typography variant='body1' noWrap >{trimString(it.value,23)}</Typography>
                            <Typography variant='caption'>{it.category}</Typography>
                        </Box>
                    </SectionItem>
                </Grid>
            ))}
            <EditDialog title={selected ? "Edit Email" : "New Email"} open={dialog} onClose={handleClose}>
                <EmailEditor data={selected} isNew={!selected} contactId={id} done={handleClose}/>
            </EditDialog>
        </Grid>
    );
}

export default Emails;
