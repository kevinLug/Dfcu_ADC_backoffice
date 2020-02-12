import React, {useState} from 'react';
import InfoIcon from '@material-ui/icons/Info';
import {IContact, IContactTag} from "../../types";
import Chip from '@material-ui/core/Chip';
import {AddIconButton} from "../../../../components/EditIconButton";
import EditDialog from "../../../../components/EditDialog";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import TagEditor from "../editors/TagEditor";
import SectionTitle from "./SectionTitle";

interface IProps {
    data: IContact
}

const Tags = (props: IProps) => {
    const [selected, setSelected] = useState<IContactTag | null>(null)
    const [dialog, setDialog] = useState(false)
    let {tags = [], id = ''} = props.data
    if (!tags)
        tags = []
    const handleClick = (dt: IContactTag) => () => {
        setSelected(dt)
        setDialog(true)
    }

    const handleDelete = (dt: IContactTag) => () => {
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
                    title='Tags'
                    editButton={<AddIconButton onClick={handleNew}/>}
                    icon={<InfoIcon fontSize='inherit'/>}
                />
                <Divider/>
            </Grid>
            <Grid item xs={12}>
                {tags.map(it => (
                    <Chip
                        key={it.id}
                        style={{margin: 5}}
                        size='small'
                        label={it.value}
                        onDelete={handleDelete(it)}
                        onClick={handleClick(it)}
                    />
                ))}
            </Grid>
            <EditDialog title={selected ? "Edit Tag" : "New Tag"} open={dialog} onClose={handleClose}>
                <TagEditor data={selected} isNew={!selected} contactId={id} done={handleClose}/>
            </EditDialog>
        </Grid>
    );
}

export default Tags;
