import React from "react";
import {createStyles, makeStyles, Theme, Typography} from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";
import amber from "@material-ui/core/colors/amber";
import MailIcon from "@material-ui/core/SvgIcon/SvgIcon";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        error: {
            color: 'white',
            backgroundColor: red[400],
            padding: 3,
            borderRadius: 4,
        },
        warning: {
            color: 'white',
            backgroundColor: amber[800],
            padding: 3,
            borderRadius: 4
        },
        success: {
            color: 'white',
            backgroundColor: green[500],
            padding: 3,
            borderRadius: 4
        }
    }),
);


export const ErrorLabel = (props: any) => {
    const classes = useStyles()
    return <Typography variant='caption' className={classes.error}>{props.children}</Typography>
}

export const WarnLabel = (props: any) => {
    const classes = useStyles()
    return <Typography variant='caption' className={classes.warning}>{props.children}</Typography>
}

export const SuccessLabel = (props: any) => {
    const classes = useStyles()
    return <Typography variant='caption' className={classes.success}>{props.children}</Typography>
}

export const Flex = (props: any) => {
    return <div style={{display: 'flex', flexDirection: 'row'}}>
        {props.children}
    </div>
}


