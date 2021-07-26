import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar, {SnackbarOrigin} from '@material-ui/core/Snackbar';
import {Color} from "@material-ui/core";
import {warningColor} from "../../theme/custom-colors";
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles, Theme } from '@material-ui/core/styles';


function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export interface State extends SnackbarOrigin {
    open: boolean;
}

interface ISnackbarMessage {
    message: string;
    shouldOpen: boolean;
    severity: SeverityColor
}

export type SeverityColor = 'success' | 'info' | 'warning' | 'error';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

export default function PositionedSnackbar({message, shouldOpen, severity}: ISnackbarMessage) {
    const classes = useStyles();

    const [state, setState] = React.useState<State>({
        open: shouldOpen,
        vertical: 'top',
        horizontal: 'center',
    });
    const {vertical, horizontal, open} = state;

    const handleClose = () => {
        setState({...state, open: false});
    };

    return (
        <div className={classes.root}>
            {/*{buttons}*/}
            <Snackbar
                anchorOrigin={{vertical, horizontal}}
                open={open}
                onClose={handleClose}
                // message={message}
                key={vertical + horizontal}
            >
                <Alert onClose={handleClose} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}
