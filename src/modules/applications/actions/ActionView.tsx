import React, {Component} from 'react';
import Typography from "@material-ui/core/Typography";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import {createStyles, Divider, makeStyles, Theme} from "@material-ui/core";
import {IAction} from "../types";
import Grid from "@material-ui/core/Grid";
import ActionStatusView from "./ActionStatusView";
import BaseTemplate from "./templates/base-template";

interface IProps {
    action: IAction,
    children?: React.ReactNode
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            borderRadius: 0
        },
        header: {
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
        }
    })
);

const ActionView = ({action}: IProps) => {
    const classes = useStyles()
    let ViewComponent: any = BaseTemplate
    if (action.template) {
        const template: string = action.template
        ViewComponent = React.lazy(() => import(template));
    }

    return (
        <Card className={classes.root}>
            <CardHeader
                className={classes.header}
                title={
                    <Grid container spacing={0}>
                        <Grid item xs={6}>
                            <Typography variant="h6">
                                {action.title}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Grid container spacing={0} justify='flex-end'>
                                <ActionStatusView data={action}/>
                            </Grid>
                        </Grid>
                    </Grid>
                }
            />
            <Divider/>
            <CardContent>
                <ViewComponent action={action}/>
            </CardContent>
        </Card>
    );
}


export default ActionView;
