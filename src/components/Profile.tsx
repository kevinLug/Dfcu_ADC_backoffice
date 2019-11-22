import React, {useState} from 'react';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import Avatar from '@material-ui/core/Avatar';
import {useSelector} from "react-redux";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import HiddenJs from "@material-ui/core/Hidden/HiddenJs";
import {getInitials} from "../utils/stringHelpers";
import {ICoreState} from "../data/coreReducer";
import authService from "../data/oidc/AuthService";

export const BarView = (props: any) => {
    const {user={}}: ICoreState = useSelector((state: any) => state.core)

    const [dialogOpen, setDialogOpen] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    function openDialog() {
        setDialogOpen(true)
    }

    function doLogout() {
        authService.logout()
    }

    function closeDialog() {
        setDialogOpen(false)
    }

    function handleMenu(event: React.MouseEvent<HTMLElement>) {
        setAnchorEl(event.currentTarget);
    }

    function handleCloseMenu() {
        setAnchorEl(null);
    }

    return <div>
        <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
        >
            <AccountCircle className={props.textClass}/>
            &nbsp;
            <HiddenJs xsDown>
                <Typography className={props.textClass}>{user.name}</Typography>
            </HiddenJs>
            <HiddenJs smUp>
                <Typography className={props.textClass}>{getInitials(user.name)}</Typography>
            </HiddenJs>

        </IconButton>
        <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={menuOpen}
            onClose={handleCloseMenu}
        >
            <MenuItem onClick={openDialog}>Profile</MenuItem>
            <MenuItem onClick={doLogout}>Logout</MenuItem>
        </Menu>
        <Dialog onClose={closeDialog} aria-labelledby="simple-dialog-title" open={dialogOpen}>
            <List>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <PersonIcon/>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={user.fullName}/>
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <MailIcon/>
                    </ListItemIcon>
                    <ListItemText primary={user.email}/>
                </ListItem>
            </List>
        </Dialog>
    </div>
}


