import React, {useState} from 'react';
import Grid from "@material-ui/core/Grid";
import {ActionStatus, canRunAction, IManualDecision, IWorkflow} from "../../../types";
import DataValue from "../../../../../components/DataValue";
import {getInitials} from "../../../../../utils/stringHelpers";
import UserLink from "../../../../../components/links/UserLink";
import {errorColor, successColor} from "../../../../../theme/custom-colors";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import {Button, Dialog, DialogContent, DialogTitle, TextField, Typography} from "@material-ui/core";
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
import Box from "@material-ui/core/Box";
import PdfViewer from "../../../../../components/PdfViewer";
import {IState} from "../../../../../data/types";
import Alert from "@material-ui/lab/Alert";


interface IFormProps {
    onClose: () => any,
    isForm: boolean
}

const VerifyForm = (props: IFormProps & ITemplateProps) => {

    const dispatch: Dispatch<any> = useDispatch();
    const initialState: any = {remarks: '', approved: false}
    const [metaData, setMetaData] = useState<any>(initialState)
    const [loading, setLoading] = useState<boolean>(false)
    const workflow: IWorkflow = useSelector((state: any) => state.workflows.workflow)
    const documents = useSelector((state: IState) => state.core.documents)

    // TODO fix me
    let form = workflow.documents.filter(it => it.fileName.toLocaleLowerCase().indexOf('applicationform') > -1)[0]
    form = form || workflow.documents.filter(it => it.fileName.toLocaleLowerCase().indexOf('null') > -1 && it.fileName.toLocaleLowerCase().indexOf('.pdf') > -1)[0]
    const photo = workflow.documents.filter(it => it.fileName.toLocaleLowerCase().indexOf('passportphoto') > -1)[0]
    if (!form || !photo) {
        return <Box p={3}>
            <Alert severity="error"><Typography>Failed to read documents</Typography></Alert>
        </Box>
    }

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

    const magnifier = 1;
    const height = 842 * magnifier
    const width = 630 * magnifier
    return (
        <Grid container spacing={1} style={{height,minWidth:1000}} alignContent='center' justify='center'>
            <Grid style={{height: '100%', width}}>
                <Box p={2} css={{height: '100%'}}>
                    <PdfViewer data={documents[form.id]}/>
                </Box>
            </Grid>
            <Grid style={{height: '100%', width: 250}}>
                <Box
                    display='flex'
                    flexDirection="column-reverse"
                    css={{height: '100%'}}
                    p={2}
                >
                    <Box alignSelf='flex-end' css={{width: '100%'}}>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <img
                                    style={{height: 150, width: 150}}
                                    src={documents[photo.id]}
                                    alt='Profile Photo'
                                />
                            </Grid>
                        </Grid>
                    </Box>
                    {
                        props.isForm &&
                        <Box pb={12} css={{width: '100%'}}>
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
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                color="primary"
                                                onClick={handleDecision}
                                                disabled={loading}
                                            >
                                                Submit
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    }

                </Box>
            </Grid>

        </Grid>
    );
}

const Index = (props: ITemplateProps) => {
    const {action, taskName} = props
    const [open, setOpen] = useState<boolean>(false)
    const [preview, setPreview] = useState<boolean>(false)
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

    console.log("Docs>>>>>>", {workflow, len: workflow.documents.length})
    return (
        <Grid container spacing={0}>
            <Grid item xs={12}>
                {
                    action.status === ActionStatus.Pending &&
                    <Grid container spacing={2} alignContent='flex-end' justify='flex-end'>
                        {
                            workflow.documents.length === 0 ?
                                <Grid item sm={6}>
                                    <Box p={3}>
                                        <Alert severity="error">Failed to load documents</Alert>
                                    </Box>
                                </Grid> :
                                <Grid item>
                                    <Button variant="outlined" size="small" color="primary" onClick={handleClick}>
                                        Upload Signature
                                    </Button>
                                </Grid>
                        }

                        <VerifyDialog open={open} onClose={handleClose} title='Upload Signature'>
                            <VerifyForm onClose={handleClose} {...props} isForm={true}/>
                        </VerifyDialog>
                    </Grid>
                }
                {
                    action.status === ActionStatus.Done &&
                    <Grid container spacing={0}>
                        <Grid item xs={8}>
                            <DataValue>
                                <CheckCircleIcon fontSize='inherit' style={{color: successColor}}/>&nbsp;
                                Signature uploaded by&nbsp;
                                <UserLink
                                    id={data.userId}
                                    name={data.userName}
                                    title={data.userName}
                                />
                            </DataValue>
                        </Grid>
                        <Grid item xs={4}>
                            <Button variant="outlined" size="small" color="primary" onClick={() => setPreview(true)}>
                                Preview
                            </Button>
                        </Grid>
                    </Grid>

                }
                {
                    action.status === ActionStatus.Error &&
                    <Grid container spacing={0}>
                        <Grid item xs={8}>
                            <DataValue>
                                <HighlightOffIcon fontSize='inherit' style={{color: errorColor}}/>&nbsp;
                                Signature Rejected by
                                <UserLink
                                    id={data.userId}
                                    name={getInitials(data.userName)}
                                    title={data.userName}
                                />
                            </DataValue>
                        </Grid>
                        <Grid item xs={4}>
                            <Button variant="outlined" size="small" color="primary" onClick={() => setPreview(true)}>
                                Preview
                            </Button>
                        </Grid>
                    </Grid>

                }
                <VerifyDialog open={preview} onClose={() => setPreview(false)} title='Signature preview'>
                    <VerifyForm onClose={() => setPreview(false)} {...props} isForm={false}/>
                </VerifyDialog>
            </Grid>
        </Grid>
    );
}

interface IDialogProps {
    open: boolean
    onClose: () => any
    title: string
    children?: any
}

const VerifyDialog = (props: IDialogProps) => <Dialog open={props.open} onClose={props.onClose} maxWidth="lg">
    <DialogTitle>{props.title}</DialogTitle>
    <DialogContent>
        {props.children}
    </DialogContent>
</Dialog>

export default Index;
