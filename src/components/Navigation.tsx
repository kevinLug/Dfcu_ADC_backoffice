import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AppsIcon from '@material-ui/icons/Apps';
import PeopleIcon from '@material-ui/icons/People';
import SettingsIcon from '@material-ui/icons/Settings';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import {createStyles, makeStyles, Theme, useTheme} from '@material-ui/core/styles';
import {withRouter} from 'react-router'
import {localRoutes} from "../data/constants";
import grey from '@material-ui/core/colors/grey';
import {BarView} from "./Profile";
import logo from "../assets/download.png";
import {Typography} from "@material-ui/core";
import {themeBackGround} from "../theme/custom-colors";


const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            height: "100%",
            width: "100%"
        },
        drawer: {
            backgroundColor: themeBackGround,
            [theme.breakpoints.up('sm')]: {
                width: drawerWidth,
                flexShrink: 0,
            },
        },
        appBar: {
            marginLeft: drawerWidth,
            backgroundColor: themeBackGround,
            zIndex: theme.zIndex.drawer + 1,
        },
        title: {
            flexGrow: 1,
        },
        menuButton: {
            color: grey[50],
            [theme.breakpoints.up('sm')]: {
                display: 'none',
            },
        },
        toolbar: {
            ...theme.mixins.toolbar,
        },
        drawerPaper: {
            width: drawerWidth,
            backgroundColor: themeBackGround,
        },
        content: {
            flexGrow: 1,
            height: "100%",
        },
        body: {
            padding: theme.spacing(3),
            height: `calc(100% - ${theme.mixins.toolbar.minHeight}px)`,
            [theme.breakpoints.up('sm')]: {
                height: `calc(100% - 64px)`
            },
        },
        logoHolder: {
            flexGrow: 1,
        },
        logo: {
            [theme.breakpoints.only('xs')]: {
                height: 50 * 0.5,
                width: 311 * 0.5,
            },
            height: 50 * 0.7,
            width: 311 * 0.7,
        },
        menu: {
            color: grey[500]
        },
        menuSelected: {
            color: grey[50]
        }        ,
        drawerOpen: {
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        drawerClose: {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: theme.spacing(7) + 1,
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9) + 1,
            },
        },
    }),
);

function Navigation(props: any) {
    const classes = useStyles();
    const theme = useTheme();

    const [mobileOpen, setMobileOpen] = React.useState(false);

    function handleDrawerToggle() {
        setMobileOpen(!mobileOpen);
    }

    const onClick = (path: string) => () => {
        const {history, onClose} = props
        history.push(path)
        if (onClose)
            onClose()
    }

    const getCls = (pathStr: string): string => {
        const {match: {path}} = props
        return pathStr === path ? classes.menuSelected : classes.menu
    }

    const isSelected = (pathStr: string): boolean => {
        const {match: {path}} = props
        return pathStr === path
    }


    const drawer = (
        <div style={{backgroundColor: themeBackGround, color: 'white'}}>
            <div className={classes.toolbar}/>
            <Divider/>
            <List>
                <ListItem button onClick={onClick(localRoutes.dashboard)} selected={isSelected(localRoutes.dashboard)}>
                    <ListItemIcon>
                        <AppsIcon className={getCls(localRoutes.dashboard)}/>
                    </ListItemIcon>
                    <ListItemText primary={
                        <Typography className={getCls(localRoutes.dashboard)}>
                            Dashboard
                        </Typography>
                    }/>
                </ListItem>
                <ListItem button onClick={onClick(localRoutes.applications)}
                          selected={isSelected(localRoutes.applications)}>
                    <ListItemIcon>
                        <AssignmentIcon className={getCls(localRoutes.applications)}/>
                    </ListItemIcon>
                    <ListItemText primary={
                        <Typography className={getCls(localRoutes.applications)}>
                            Applications
                        </Typography>
                    }/>
                </ListItem>
                <ListItem button onClick={onClick(localRoutes.contacts)} selected={isSelected(localRoutes.contacts)}>
                    <ListItemIcon>
                        <PeopleIcon className={getCls(localRoutes.contacts)}/>
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <Typography className={getCls(localRoutes.contacts)}>
                                Contacts
                            </Typography>
                        }/>
                </ListItem>
                <ListItem button onClick={onClick(localRoutes.settings)} selected={isSelected(localRoutes.settings)}>
                    <ListItemIcon>
                        <SettingsIcon className={getCls(localRoutes.settings)}/>
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <Typography className={getCls(localRoutes.settings)}>
                                Settings
                            </Typography>
                        }/>
                </ListItem>
            </List>
        </div>
    );

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar position="fixed" className={classes.appBar} color='default'>
                <Toolbar>
                    <IconButton
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <div className={classes.logoHolder}>
                        <img src={logo} alt="logo" className={classes.logo}/>
                    </div>
                    <BarView textClass={classes.menuSelected}/>
                </Toolbar>
            </AppBar>
            <nav className={classes.drawer} aria-label="mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                    <Drawer
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open={false}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
            <main className={classes.content}>
                <div className={classes.toolbar}/>
                <div className={classes.body}>
                    {props.children}
                </div>
            </main>
        </div>
    );
}

export default withRouter(Navigation)