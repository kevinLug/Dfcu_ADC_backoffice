import React, {useState} from "react";
import Navigation from "../../components/Layout";
import {createStyles, makeStyles, Theme} from "@material-ui/core";
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        drawer: {
            borderRadius: 0,
        },
        content: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            })
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            })
        },
    }),
);

const Workflows = ({children}: any) => {
    const classes = useStyles();
    const [open, setOpen] = useState(true);

    return (
        <Navigation>
            <Grid container spacing={3}>
                <Grid item xs={12} className={clsx(classes.content, {[classes.contentShift]: open})}>

                    <Grid container spacing={2}>

                        {children}

                    </Grid>
                </Grid>

            </Grid>

        </Navigation>
    );
}

export default Workflows
