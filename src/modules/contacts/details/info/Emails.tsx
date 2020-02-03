import React, {useState} from 'react';
import MailIcon from '@material-ui/icons/Mail';
import {IContact, IEmail} from "../../types";
import EmailEditor from "../editors/EmailEditor";
import EditIconButton, {AddIconButton, DeleteIconButton} from "../../../../components/EditIconButton";
import EditDialog from "../../../../components/EditDialog";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import {trimString} from "../../../../utils/stringHelpers";
import SectionTitle from "./SectionTitle";
import SectionItem, {SectionItemContent} from "./SectionItem";
import EmailLink from "../../../../components/links/EmalLink";

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
        <Grid container spacing={0}>
            <Grid item xs={12}>
                <SectionTitle
                    title='Emails'
                    editButton={<AddIconButton onClick={handleNew} style={{marginTop:5}}/>}
                    icon={ <MailIcon fontSize='small'/>}
                />
                {/*<Divider/>*/}
            </Grid>
            {emails.map(it => (
                <Grid item xs={12} key={it.id} >
                    <SectionItem buttons={
                        <Box style={{padding:0}}>
                            <EditIconButton onClick={handleClick(it)}/>
                            <DeleteIconButton onClick={handleDelete(it)}/>
                        </Box>
                    }>
                        <SectionItemContent value={<EmailLink value={trimString(it.value,15)}/>} category={it.category}/>
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
