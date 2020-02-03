import React, {Suspense} from 'react';
import Typography from "@material-ui/core/Typography";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import {createStyles, Divider, makeStyles, Theme, useTheme} from "@material-ui/core";
import {IAction} from "../types";
import Grid from "@material-ui/core/Grid";
import ActionStatusView from "./ActionStatusView";
import BaseTemplate from "./templates/base-template";
import loader from "./templates/loader";
import Loading from "../../../components/Loading";

interface IProps {
    workflowId: string,
    taskName: string,
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

const ActionView = ({action, taskName, workflowId}: IProps) => {
    const classes = useStyles()
    const theme = useTheme()
    let ViewComponent: any = BaseTemplate
    if (action.template && loader.hasOwnProperty(action.template)) {
        ViewComponent = loader[action.template];
    }
    return (
        <Card className={classes.root} elevation={0}>
            <Divider/>
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
            <CardContent style={{paddingBottom: theme.spacing(1)}}>
                <Suspense fallback={<Loading/>}>
                    <ViewComponent action={action} workflowId={workflowId} taskName={taskName}/>
                </Suspense>
            </CardContent>
        </Card>
    );
}


export default ActionView;
