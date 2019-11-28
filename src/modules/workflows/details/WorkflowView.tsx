import React, {Component} from 'react';
import {WithStyles} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import {IWorkflow} from "../types";
import TaskBodyView from "../tasks/TaskBodyView";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TaskStatusView from "../tasks/TaskStatusView";
import {Paper} from "@material-ui/core";
import {printTaskIcon} from "../widgets";
import {Flex} from "../../../components/widgets";


interface IProps extends WithStyles {
    data: IWorkflow
}

const scrollToRef = (ref: any) => window.scrollTo(0, ref.current.offsetTop)

class WorkflowView extends Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
        this.state = {}
        this.handleTaskClick = this.handleTaskClick.bind(this)
    }

    myRefs: any = {}

    handleTaskClick(taskId: string) {
        console.log("Clicked",taskId)
    }

    render() {
        const classes = this.props.classes;
        const tasks = this.props.data.tasks
        return (
            <Stepper orientation="vertical" nonLinear={true} className={classes.root}>
                {tasks.map((task) => (
                    <Step key={task.id} active={true} ref={ref => this.myRefs[task.id] = ref}>
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
                            <TaskBodyView task={task} workflowId={this.props.data.id}/>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
        );
    }
}

export default WorkflowView
