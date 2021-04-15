import React, {useState} from 'react';
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
import CropFree from '@material-ui/icons/CropFree'
import SettingsIcon from '@material-ui/icons/Settings';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import {createStyles, makeStyles, Theme, useTheme} from '@material-ui/core/styles';
import {withRouter} from 'react-router'
import {hasAnyRole, localRoutes, systemRoles} from "../data/constants";
import grey from '@material-ui/core/colors/grey';
import {BarView} from "./Profile";
import logo from "../assets/download.png";
import {Box, Button, Typography} from "@material-ui/core";
import {themeBackground} from "../theme/custom-colors";
import Paper from "@material-ui/core/Paper";
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {useDispatch, useSelector} from "react-redux";
import {IState} from "../data/types";
import ModalDialog from "../utils/ModalTemplate";
import ScanCrop from "../modules/scan/ScanCrop";
import {startNewTransferRequest} from "../data/redux/coreActions";
import {Dispatch} from "redux";
import {IWorkflowState} from "../data/redux/workflows/reducer";
import {ICoreState} from "../data/redux/coreReducer";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            height: "100%",
            width: "100%"
        },
        drawer: {
            backgroundColor: themeBackground,
            [theme.breakpoints.up('sm')]: {
                width: drawerWidth,
                flexShrink: 0,
            },
        },
        appBar: {
            marginLeft: drawerWidth,
            backgroundColor: themeBackground,
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
            backgroundColor: themeBackground,
        },
        content: {
            flexGrow: 1,
            height: "100%",
        },
        body: {
            backgroundColor: grey[50],
            padding: theme.spacing(2),
            [theme.breakpoints.only('xs')]: {
                padding: 0,
            },
            height: `calc(100% - ${theme.mixins.toolbar.minHeight}px)`,
            [theme.breakpoints.up('sm')]: {
                height: `calc(100% - 64px)`
            },
            overflow: 'auto'
        },
        logoHolder: {
            // flexGrow: 1,
        },
        requestButton: {
            marginLeft: 15
        },
        logo: {
            [theme.breakpoints.only('xs')]: {
                height: 25,
                width: 'auto',
            },
            height: 30,
            width: 'auto',
        },
        menu: {
            color: grey[500]
        },
        menuSelected: {
            color: grey[50],

        },
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
        nested: {
            paddingLeft: theme.spacing(9),
        }
    }),
);


interface ItemProps {
    text: string,
    route: string,
    Icon: any
}

interface CollapsibleItemProps {
    text: string,
    Icon: any,
    items: ItemProps[]
}

function Layout(props: any) {
    const classes = useStyles();
    const theme = useTheme();
    const user = useSelector((state: IState) => state.core.user)
    // const [startNewTransferRequest, setStartNewTransferRequest] = useState<boolean>(false)

    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [showScanner,setShowScanner] = useState(false)

    const dispatch: Dispatch<any> = useDispatch();

    function handleDrawerToggle() {
        setMobileOpen(!mobileOpen);
    }

    function addNewRequest() {

    }

    function startNewTransfer(){
        setShowScanner(true)
        dispatch(startNewTransferRequest(showScanner))
    }

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
                        <MenuIcon/>
                    </IconButton>
                    <div className={classes.logoHolder}>
                        <img src={logo} alt="logo" className={classes.logo}/>
                    </div>

                    <div className={classes.requestButton}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={startNewTransfer}
                        >
                            New Transfer Request
                        </Button>
                    </div>

                    {/*<Box className={classes.transferInitiator}>*/}
                    {/*    <Button variant="contained" color="primary" onClick={pickImage}>NEW TRANSFER REQUEST</Button>*/}
                    {/*</Box>*/}


                    <BarView textClass={classes.menuSelected}/>
                </Toolbar>
            </AppBar>

            <main className={classes.content}>
                <div className={classes.toolbar}/>
                <Paper className={classes.body}>
                    {props.children}
                </Paper>
            </main>
        </div>
    );
}

export default withRouter(Layout)
