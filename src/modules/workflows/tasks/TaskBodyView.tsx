import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {ITask, IWorkflow} from "../types";
import ActionView from "../actions/ActionView";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        actionGrid: {
            marginBottom: theme.spacing(1)
        },
    }),
);

interface IProps {
    task: ITask
    workflowId:string
    workflow?:IWorkflow
}

const TaskBodyView = (props: IProps) => {
    const {task: {actions, name}, workflowId,workflow} = props
    const fineActions = actions.filter(it => it.shouldRender)
    const classes = useStyles();
    return <Grid container className={classes.root} spacing={0}>
        {
            fineActions.map(it => {
                return <Grid key={it.id} item xs={12} className={classes.actionGrid}>
                    <ActionView
                        action={it}
                        taskName={name}
                        workflowId={workflowId}
                        workflow={workflow}
                    />
                </Grid>
            })
        }
    </Grid>;
}


export default TaskBodyView;
