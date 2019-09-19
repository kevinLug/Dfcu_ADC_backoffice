import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PinDropIcon from '@material-ui/icons/PinDrop';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import MoreVert from '@material-ui/icons/MoreVert';
import IBox from "../../../components/ibox/IBox";
import {IContact, printAddress} from "../types";
import {createStyles, makeStyles, Theme} from "@material-ui/core";

interface IProps {
    data: IContact
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(2),
            borderRadius: 0
        },
        noPadding: {
            padding: 0
        }
    })
);

const Addresses = (props: IProps) => {
    const classes = useStyles()
    const {addresses} = props.data
    const title = <div style={{display: 'flex', flexDirection: 'row'}}>
        <PinDropIcon fontSize='small'/><span>&nbsp;Addresses</span>
    </div>
    return (
        <IBox title={title}>
            <List className={classes.noPadding}>
                {addresses.map(it => (
                    <ListItem button key={it.id} className={classes.noPadding}>
                        <ListItemText primary={printAddress(it)} secondary={it.category}/>
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="actions">
                                <MoreVert/>
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}

            </List>
        </IBox>
    );
}


export default Addresses;
