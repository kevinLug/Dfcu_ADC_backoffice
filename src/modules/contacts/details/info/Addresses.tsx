import React, {useState} from 'react';
import PinDropIcon from '@material-ui/icons/PinDrop';
import {IAddress, IContact, printAddress} from "../../types";
import EditIconButton, {AddIconButton, DeleteIconButton} from "../../../../components/EditIconButton";
import EditDialog from "../../../../components/EditDialog";
import AddressEditor from "../editors/AddressEditor";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import PersonIcon from "@material-ui/icons/PermIdentity";
import SectionTitle from "./SectionTitle";
import {printDate} from "../../../../utils/dateHelpers";
import SectionItem from "./SectionItem";

interface IProps {
    data: IContact
}



const Addresses = (props: IProps) => {
    const [selected, setSelected] = useState<IAddress | null>(null)
    const [dialog, setDialog] = useState(false)


    const handleClick = (dt: IAddress) => () => {
        setSelected(dt)
        setDialog(true)
    }

    const handleClose = () => {
        setDialog(false)
        setSelected(null)
    }

    const handleNew = () => {
        setSelected(null)
        setDialog(true)
    }
    const {addresses,id=''} = props.data

    const handleDelete = (dt: IAddress) => () => {
        //TODO
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <SectionTitle
                    title='Addresses'
                    editButton={<AddIconButton onClick={handleNew}/>}
                    icon={ <PinDropIcon fontSize='inherit'/>}
                />
                <Divider/>
            </Grid>
            {addresses.map(it => (
                <Grid item xs={12} key={it.id}>
                    <SectionItem buttons={
                        <Box>
                            <EditIconButton onClick={handleClick(it)}/>
                            <DeleteIconButton onClick={handleDelete(it)}/>
                        </Box>
                    }>
                        <Box flexGrow={1}>
                            <Typography variant='body1'>{printAddress(it)}</Typography>
                            <Typography variant='caption'>{it.category}</Typography>
                        </Box>
                    </SectionItem>
                </Grid>
            ))}
            <EditDialog title={selected ? "Edit Address" : "New Address"} open={dialog} onClose={handleClose}>
                <AddressEditor data={selected} isNew={!selected} contactId={id} done={handleClose}/>
            </EditDialog>
        </Grid>
    );
}

export default Addresses;
