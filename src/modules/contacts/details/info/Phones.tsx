import React, {useState} from 'react';
import PhoneIcon from '@material-ui/icons/Phone';
import {IContact, IPhone} from "../../types";
import EditIconButton, {AddIconButton, DeleteIconButton} from "../../../../components/EditIconButton";
import EditDialog from "../../../../components/EditDialog";
import PhoneEditor from "../editors/PhoneEditor";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import SectionTitle from "./SectionTitle";
import SectionItem, {SectionItemContent} from "./SectionItem";

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
        <Grid container spacing={0}>
            <Grid item xs={12} >
                <SectionTitle
                    title='Phones'
                    editButton={<AddIconButton onClick={handleNew} style={{marginTop:5}}/>}
                    icon={ <PhoneIcon fontSize='small' />}
                />
                {/*<Divider/>*/}
            </Grid>
            {phones.map(it => (
                <Grid item xs={12} key={it.id} style={{paddingTop:0}}>
                    <SectionItem buttons={
                        <Box>
                            <EditIconButton onClick={handleClick(it)}/>
                            <DeleteIconButton onClick={handleDelete(it)}/>
                        </Box>
                    }>
                        <SectionItemContent value={it.value} category={it.category}/>
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
