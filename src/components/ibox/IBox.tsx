import React from 'react';
import Typography from "@material-ui/core/Typography";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import {createStyles, Divider, makeStyles, Theme} from "@material-ui/core";

interface IProps {
    title: any
    children?: any
    action?: any
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            borderRadius: 0
        },
        header: {
            // paddingTop: theme.spacing(1),
            // paddingBottom: theme.spacing(1),
        }
    })
);

const IBox = (props: IProps) => {
    const classes = useStyles()
    return (
        <Card className={classes.root}>
            <CardHeader
                className={classes.header}
                title={
                    <Typography variant="h5">
                        {props.title}
                    </Typography>
                }
                action={props.action}
            />
            <Divider/>
            <CardContent>
                {props.children}
            </CardContent>
        </Card>
    );
}

export default IBox;
