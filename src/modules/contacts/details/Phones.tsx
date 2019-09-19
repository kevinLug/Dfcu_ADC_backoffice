import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PhoneIcon from '@material-ui/icons/Phone';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import MoreVert from '@material-ui/icons/MoreVert';
import IBox from "../../../components/ibox/IBox";
import {IContact} from "../types";
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

const Phones = (props: IProps) => {
    const classes = useStyles()
    const {phones} = props.data
    const title = <div style={{display: 'flex', flexDirection: 'row'}}>
        <PhoneIcon fontSize='small'/><span>&nbsp;Phones</span>
    </div>
    return (
        <IBox title={title}>
            <List className={classes.noPadding}>
                {phones.map(it => (
                    <ListItem button key={it.id} className={classes.noPadding}>
                        <ListItemText primary={it.value} secondary={it.category}/>
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


export default Phones;
