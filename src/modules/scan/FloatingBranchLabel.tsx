import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';

import DataAccessConfigs from '../../data/dataAccessConfigs';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            margin: 0,
            top: "auto",
            right: 'auto',
            bottom: 20,
            left: 20,
            position: 'fixed',
        },
        extendedIcon: {
            marginRight: theme.spacing(1),
        },
        serverIsReachable: {
            color: "green"
        },
        serverIsNotReachable: {
            color: "red"
        }
    }),
);

export default function FloatingBranchLabel() {

    const classes = useStyles();

    return (
        <div className={classes.root}>

            {
                'No branch selected' !== DataAccessConfigs.getBranchName() ?
                    <Fab variant="extended" className={classes.serverIsReachable} aria-label="add">
                        {DataAccessConfigs.getBranchName()}
                    </Fab>
                    :
                    <Fab variant="extended" className={classes.serverIsNotReachable} aria-label="add">
                        {DataAccessConfigs.getBranchName()}
                    </Fab>
            }


        </div>

    );
}
