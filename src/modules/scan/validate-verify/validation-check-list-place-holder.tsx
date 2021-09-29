import React from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import {Alert, AlertTitle} from '@material-ui/lab';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            '& > * + *': {
                marginTop: theme.spacing(2),
            },
        },
    }),
);

export default function DescriptionAlerts() {
    const classes = useStyles();

    return (
        <div className={classes.root}>

            <Alert severity="warning">
                Please upload application form to start the validation process
            </Alert>

        </div>
    );
}
