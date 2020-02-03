import React, {useState} from 'react';
import Grid from "@material-ui/core/Grid";
import {ActionStatus, canRunAction, IManualDecision, IWorkflow} from "../../../types";
import DataValue from "../../../../../components/DataValue";
import {getInitials} from "../../../../../utils/stringHelpers";
import UserLink from "../../../../../components/links/UserLink";
import {errorColor, successColor} from "../../../../../theme/custom-colors";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import {Button, TextField} from "@material-ui/core";
import EditDialog from "../../../../../components/EditDialog";
import Pending from "../pending";
import {useDispatch, useSelector} from "react-redux";
import ITemplateProps from "../ITemplateProps";
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {hasValue} from "../../../../../components/inputs/inputHelpers";
import Toast from "../../../../../utils/Toast";
import {post} from "../../../../../utils/ajax";
import {remoteRoutes} from "../../../../../data/constants";
import {fetchWorkflowAsync, startWorkflowFetch} from "../../../../../data/redux/workflows/reducer";
import {Dispatch} from "redux";


interface IFormProps {
    onClose: () => any
}

const VerifyForm = (props: IFormProps & ITemplateProps) => {

    const dispatch: Dispatch<any> = useDispatch();
    const initialState: any = {remarks: '', approved: false}
    const [metaData, setMetaData] = useState<any>(initialState)
    const [loading, setLoading] = useState<boolean>(false)

    const handleTextChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setMetaData({...metaData, [name]: event.target.value});
    };

    const handleCbChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setMetaData({...metaData, [name]: event.target.checked});
    };

    function handleDecision() {
        const hasRemarks = hasValue(metaData['remarks'])
        if (!metaData.approved && !hasRemarks) {
            Toast.error("Please enter a remark")
            return
        }
        const data: IManualDecision = {
            caseId: props.workflowId,
            taskName: props.taskName,
            actionName: props.action.name,
            nextSubStatus: metaData.approved ? props.action.nextStatusSuccess : props.action.nextStatusError,
            resumeCase: false,
            override: false,
            data: metaData
        }
        setLoading(true)
        post(
            remoteRoutes.workflowsManual,
            data,
            () => {
                setLoading(false)
                props.onClose()
                reloadCase()
            },
            undefined,
            () => {
                setLoading(false)
            }
        )
    }

    function reloadCase() {
        dispatch(startWorkflowFetch())
        dispatch(fetchWorkflowAsync(props.workflowId))
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <FormGroup>
                    <FormControlLabel
                        label='Approved'
                        control={
                            <Checkbox
                                checked={metaData['approved']}
                                onChange={handleCbChange('approved')}
                                value={metaData['approved']}
                            />
                        }
                    />
                </FormGroup>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    id="remarks-field"
                    label="Remarks"
                    fullWidth
                    multiline
                    rowsMax="3"
                    rows='3'
                    value={metaData['remarks']}
                    onChange={handleTextChange('remarks')}
                    margin="none"
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={2} alignContent='flex-end' justify='flex-end'>
                    <Grid item>
                        <Button variant="outlined" size="small" color="primary" onClick={handleDecision} disabled={loading}>
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

const Index = (props: ITemplateProps) => {
    const {action, taskName} = props
    const [open, setOpen] = useState<boolean>(false)
    const workflow: IWorkflow = useSelector((state: any) => state.workflows.workflow)
    const canRun = canRunAction(action.name, taskName, workflow)
    const dataString = action.outputData
    const data: any = dataString ? JSON.parse(dataString) : {};

    function handleClick() {
        setOpen(true)
    }

    function handleClose() {
        setOpen(false)
    }

    if (!canRun) {
        return <Pending text="Pending Execution"/>
    }

    return (
        <Grid container spacing={0}>
            <Grid item xs={12}>
                {
                    action.status === ActionStatus.Pending &&
                    <Grid container spacing={2} alignContent='flex-end' justify='flex-end'>
                        <Grid item>
                            <Button variant="outlined" size="small" color="primary" onClick={handleClick}>
                                Validate Account
                            </Button>
                        </Grid>
                        <EditDialog open={open} onClose={handleClose} title='Verify Account'>
                            <VerifyForm onClose={handleClose} {...props}/>
                        </EditDialog>
                    </Grid>
                }
                {
                    action.status === ActionStatus.Done &&
                    <DataValue>
                        <CheckCircleIcon fontSize='inherit' style={{color: successColor}}/>&nbsp;
                        Account Verified by&nbsp;
                        <UserLink
                            id={data.userId}
                            name={getInitials(data.userName)}
                            title={data.userName}
                        />
                    </DataValue>
                }
                {
                    action.status === ActionStatus.Error &&
                    <DataValue>
                        <HighlightOffIcon fontSize='inherit' style={{color: errorColor}}/>&nbsp;
                        Account Rejected by
                        <UserLink
                            id={data.userId}
                            name={getInitials(data.userName)}
                            title={data.userName}
                        />
                    </DataValue>
                }
            </Grid>
        </Grid>
    );
}

export default Index;
