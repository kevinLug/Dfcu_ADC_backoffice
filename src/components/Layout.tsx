import React, {useState} from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';

import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {withRouter} from 'react-router';
import {hasAnyRole, localRoutes, systemRoles} from "../data/constants";
import grey from '@material-ui/core/colors/grey';
import {BarView} from "./Profile";
import logo from "../assets/download.png";
import {Button} from "@material-ui/core";
import {linkColor, themeBackground} from "../theme/custom-colors";
import Paper from "@material-ui/core/Paper";
import {useDispatch, useSelector} from "react-redux";
import {startNewTransferRequest} from "../data/redux/coreActions";
import {Dispatch} from "redux";
import {IState} from "../data/types";
import {Link} from "react-router-dom";
import FloatingActionButtons from "../modules/scan/FloatingIcon";
import {actionICheckKeyValue} from "../data/redux/checks/reducer";
import {ICaseDefault, ICheckKeyValueDefault} from "../modules/transfers/types";
import {actionICaseState, initialState} from "../data/redux/transfers/reducer";

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

function Layout(props: any) {

    const classes = useStyles();
    //const theme = useTheme();
    const user = useSelector((state: IState) => state.core.user)
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [showScanner, setShowScanner] = useState(false)
    const [btnTransferName, setBtnTransferName] = useState("NEW TRANSFER REQUEST")

    const dispatch: Dispatch<any> = useDispatch();

    function handleDrawerToggle() {
        setMobileOpen(!mobileOpen);
    }

    function startNewTransfer() {
        if (btnTransferName === "NEW TRANSFER REQUEST") {
            setShowScanner(true)
            dispatch(startNewTransferRequest(showScanner))
            setBtnTransferName("⬅️BACK")
        } else {
            setBtnTransferName("NEW TRANSFER REQUEST")
            window.location.reload()
        }
        dispatch(actionICaseState(ICaseDefault));
        dispatch(actionICheckKeyValue(ICheckKeyValueDefault))
    }

    function canShowRequestButton() {
        return (hasAnyRole(user, [systemRoles.CSO]) && window.location.pathname === "/")
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

                    {canShowRequestButton() ?
                        <div className={classes.requestButton}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={startNewTransfer}
                            >
                                {btnTransferName}
                            </Button>
                        </div>
                        : ""}

                    <BarView textClass={classes.menuSelected}/>
                </Toolbar>
            </AppBar>

            <main className={classes.content}>
                <div className={classes.toolbar}/>
                <Paper className={classes.body}>
                    {props.children}
                    <FloatingActionButtons/>
                </Paper>
            </main>
        </div>
    );
}

export default withRouter(Layout)
