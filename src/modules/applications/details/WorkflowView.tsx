import React, {useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import {IWorkflow} from "../types";
import TaskBodyView from "../tasks/TaskBodyView";
import {backgroundGrey, successColor} from "../../../theme/custom-colors";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TaskStatusView from "../tasks/TaskStatusView";
import {Paper} from "@material-ui/core";
import {printTaskIcon} from "../widgets";
import {Flex} from "../../../components/widgets";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: 0
        },
        stepPaper: {
            borderRadius: 0,
        },
        stepLabel: {
            backgroundColor: backgroundGrey,
            padding: theme.spacing(1)
        },
        stepContent: {
            paddingRight: 0
        },
        taskIcon: {
            marginTop: 1
        },
        successIcon: {
            color: successColor
        }
    }),
);

interface IProps {
    data: IWorkflow
}


const WorkflowView = (props: IProps) => {
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);

    const tasks = props.data.tasks


    return (
        <Stepper orientation="vertical" nonLinear={true} className={classes.root}>
            {tasks.map((task) => (
                <Step key={task.id} active={true}>
                    <StepLabel StepIconComponent={printTaskIcon(task)}>
                        <Paper className={classes.stepPaper}>
                            <Grid container spacing={0} className={classes.stepLabel}>
                                <Grid item xs={6}>
                                    <Flex>
                                        <Typography variant='h5'>
                                            &nbsp;{task.title}
                                        </Typography>
                                    </Flex>
                                </Grid>
                                <Grid item xs={6}>
                                    <Grid container spacing={0} justify='flex-end'>
                                        <TaskStatusView data={task}/>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>
                    </StepLabel>
                    <StepContent className={classes.stepContent}>
                        <TaskBodyView task={task}/>
                    </StepContent>
                </Step>
            ))}
        </Stepper>
    );
}


export default WorkflowView;
