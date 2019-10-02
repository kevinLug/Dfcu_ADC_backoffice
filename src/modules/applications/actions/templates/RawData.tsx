import React, {useState} from 'react';
import {Grid} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import {IAction} from "../../types";
import {prettyJson} from "../../../../utils/jsonHelpers";
import {grey} from "@material-ui/core/colors";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        headingWrapper: {
            margin: 0
        },
        heading: {
            textAlign: 'right',
            width: '100%',
            paddingBottom: 0
        },
        link: {
            color: theme.palette.primary.main,
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'underline',
            },
        },
        code: {
            width: '100%',
            height: 150,
            backgroundColor: grey[50],
            borderRadius: 4,
            margin: 0,
            overflow: 'auto'
        },
        showIo: {
            display: 'block'
        },
        hideIo: {
            display: 'none'
        }
    }),
);

interface IProps {
    action: IAction
}

const RawData = ({action}: IProps) => {
    const [open, setOpen] = useState(false)
    const classes = useStyles();

    function toggleIo(e: any) {
        e.preventDefault()
        setOpen(!open)
    }

    const noPadding = {
        padding: 0
    }
    return (
        <Grid container spacing={0}>
            <Grid item xs={12} className={classes.heading} style={noPadding}>
                <a href='/' className={classes.link} onClick={toggleIo}>{open ? '- Hide I/O' : '+ Show I/O'}</a>
            </Grid>
            <Grid item xs={12} style={noPadding} className={open ? classes.showIo : classes.hideIo}>
                <Divider/>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant='caption'>Input</Typography>
                        <pre className={classes.code}>
                            {prettyJson(action.inputData)}
                        </pre>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant='caption'>Output</Typography>
                        <pre className={classes.code}>
                            {prettyJson(action.outputData)}
                        </pre>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}
export default RawData;
