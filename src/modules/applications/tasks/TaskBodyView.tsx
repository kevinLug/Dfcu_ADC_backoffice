import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {ITask} from "../types";
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
}

const TaskBodyView = (props: IProps) => {
    const {task: {actions}} = props
    const fineActions = actions.filter(it => it.shouldRender)
    const classes = useStyles();
    return <Grid container className={classes.root} spacing={0}>
        {
            fineActions.map(it => {
                return <Grid key={it.id} item xs={12} className={classes.actionGrid}>
                    <ActionView
                        action={it}
                    />
                </Grid>
            })
        }
    </Grid>;
}


export default TaskBodyView;
