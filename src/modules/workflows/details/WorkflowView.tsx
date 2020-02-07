import React, {useEffect} from 'react';
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
import {useDispatch, useSelector} from "react-redux";
import {hasValue} from "../../../components/inputs/inputHelpers";
import {remoteRoutes} from "../../../data/constants";
import {downLoad} from "../../../utils/ajax";
import {saveDocument} from "../../../data/redux/coreActions";
import {IState} from "../../../data/types";

interface IProps extends WithStyles {
    data: IWorkflow
}

function WorkflowView({classes,data}: IProps) {

    const tasks = data.tasks
    const docs = data.documents
    const documents = useSelector((state: IState) => state.core.documents)
    const dispatch = useDispatch()
    useEffect(() => {
        for (let doc of docs) {
            if (hasValue(documents[doc.id]))
                continue;
            const url = `${remoteRoutes.documentsDownload}/${doc.id}`
            downLoad(url, blobResp => {
                dispatch(saveDocument({id: doc.id, url: URL.createObjectURL(blobResp)}))
            })
        }
    }, [])
    return (
        <Stepper orientation="vertical" nonLinear={true} className={classes.root}>
            {tasks.map((task) => (
                <Step key={task.id} active={true}>
                    <StepLabel StepIconComponent={printTaskIcon(task)}>
                        <Paper className={classes.stepPaper} elevation={0}>
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
                        <TaskBodyView task={task} workflowId={data.id}/>
                    </StepContent>
                </Step>
            ))}
        </Stepper>
    );
}

export default WorkflowView
