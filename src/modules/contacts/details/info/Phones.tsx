import React, {useState} from 'react';
import PhoneIcon from '@material-ui/icons/Phone';
import {IContact, IPhone} from "../../types";
import EditIconButton, {AddIconButton, DeleteIconButton} from "../../../../components/EditIconButton";
import EditDialog from "../../../../components/EditDialog";
import PhoneEditor from "../editors/PhoneEditor";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import SectionTitle from "./SectionTitle";
import ListIcon from "@material-ui/icons/List";
import {trimString} from "../../../../utils/stringHelpers";
import SectionItem from "./SectionItem";

interface IProps {
    data: IContact
}

const Phones = (props: IProps) => {
    const [selected, setSelected] = useState<IPhone | null>(null)
    const [dialog, setDialog] = useState(false)

    const handleClick = (phone: IPhone) => () => {
        setSelected(phone)
        setDialog(true)
    }

    const handleClose = () => {
        setDialog(false)
        setSelected(null)
    }

    const handleDelete = (phone: IPhone) => () => {
        //TODO
    }

    const handleNew = () => {
        setSelected(null)
        setDialog(true)
    }

    const {phones, id = ''} = props.data

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <SectionTitle
                    title='Phones'
                    editButton={<AddIconButton onClick={handleNew}/>}
                    icon={ <PhoneIcon fontSize='inherit' />}
                />
                <Divider/>
            </Grid>
            {phones.map(it => (
                <Grid item xs={12} key={it.id}>
                    <SectionItem buttons={
                        <Box>
                            <EditIconButton onClick={handleClick(it)}/>
                            <DeleteIconButton onClick={handleDelete(it)}/>
                        </Box>
                    }>
                        <Box flexGrow={1}>
                            <Typography variant='body1'>{it.value}</Typography>
                            <Typography variant='caption'>{it.category}</Typography>
                        </Box>
                    </SectionItem>
                </Grid>
            ))}
            <EditDialog title={selected ? "Edit Phone" : "New Phone"} open={dialog} onClose={handleClose}>
                <PhoneEditor data={selected} isNew={!selected} contactId={id} done={handleClose}/>
            </EditDialog>
        </Grid>
    );
}

export default Phones;
