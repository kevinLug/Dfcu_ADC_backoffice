import React, {useState} from 'react';
import {IContact, IIdentification} from "../../types";
import {printDate} from "../../../../utils/dateHelpers";
import EditIconButton, {AddIconButton, DeleteIconButton} from "../../../../components/EditIconButton";
import {Divider} from "@material-ui/core";
import ListIcon from "@material-ui/icons/List";
import EditDialog from "../../../../components/EditDialog";
import IdentificationEditor from "../editors/IdentificationEditor";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import SectionTitle from "./SectionTitle";
import SectionItem from "./SectionItem";

interface IProps {
    data: IContact
}

const Identifications = ({data}: IProps) => {
    const {identifications, id = ''} = data
    const [selected, setSelected] = useState<IIdentification | null>(null)
    const [dialog, setDialog] = useState(false)


    const handleClick = (dt: IIdentification) => () => {
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

    const handleDelete = (dt: IIdentification) => () => {
        //TODO
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <SectionTitle
                    title='Identifications'
                    editButton={<AddIconButton onClick={handleNew}/>}
                    icon={ <ListIcon fontSize='inherit' />}
                />
                <Divider/>
            </Grid>
            {identifications.map(it => (
                <Grid item xs={12} key={it.id}>
                    <SectionItem buttons={
                        <Box>
                            <EditIconButton onClick={handleClick(it)}/>
                            <DeleteIconButton onClick={handleDelete(it)}/>
                        </Box>
                    }>
                        <Box flexGrow={1}>
                            <Typography variant='body1'>{it.value}</Typography>
                            <Typography variant='body2'>{it.category}&nbsp;</Typography>
                            <Typography variant='caption'>
                                Valid from {printDate(it.issueDate)}&nbsp;to&nbsp;{printDate(it.expiryDate)}
                            </Typography>
                        </Box>
                    </SectionItem>
                </Grid>
            ))}
            <EditDialog title={selected ? "Edit Identification" : "New Identification"} open={dialog} onClose={handleClose}>
                <IdentificationEditor data={selected} isNew={!selected} contactId={id} done={handleClose}/>
            </EditDialog>
        </Grid>
    );
}
export default Identifications;
