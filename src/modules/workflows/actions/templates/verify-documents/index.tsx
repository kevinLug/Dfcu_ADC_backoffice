import React, { useState } from 'react';
import Grid from "@material-ui/core/Grid";
import { ActionStatus, canRunAction, IWorkflow } from "../../../types";
import DataValue from "../../../../../components/DataValue";
import { errorColor, successColor, warningColor } from "../../../../../theme/custom-colors";
import { Button } from "@material-ui/core";
import Preview from "./Preview";
import Verify from "./Verify";
import ITemplateProps from "../ITemplateProps";
import Box from "@material-ui/core/Box";
import { useSelector } from "react-redux";
import Pending from "../pending";
import { IState } from "../../../../../data/types";
import DocumentsChecks from "./DocumentsChecks";
import { getGatewayDocsList } from "./helpers";
import DocumentsList from "./DocumentsList";
import { ErrorIcon, SuccessIcon } from "../../../../../components/xicons";
import UserLink from "../../../../../components/links/UserLink";
import Typography from "@material-ui/core/Typography";
import { Alert } from "@material-ui/lab";
import DocsUpdater from "./update-docs/DocsUpdater";


const Index = (props: ITemplateProps) => {
    const { action, taskName } = props
    const workflow: IWorkflow = useSelector((state: any) => state.workflows.workflow)
    const metadata = useSelector((state: IState) => state.core.metadata)
    const docs = workflow.documents
    const gatewayDocsList = getGatewayDocsList(workflow.type, workflow.metaData.product, metadata.transferCategories)
    const canRun = canRunAction(action.name, taskName, workflow)
    const [preview, setPreview] = useState(false)
    const [verify, setVerify] = useState(false)
    const [update, setUpdate] = useState(false)

    function previewDocs() {
        setPreview(true)
    }

    function verifyDocs() {
        setVerify(true)
    }

    function closePreview() {
        return setPreview(false);
    }

    function closeVerify() {
        return setVerify(false);
    }

    if (!canRun) {
        return <Pending text="Pending Execution" />
    }
    const isPending = action.status === ActionStatus.Pending
    const isDone = action.status === ActionStatus.Done
    let color = warningColor
    if (action.status === ActionStatus.Error) {
        color = errorColor
    } else if (action.status === ActionStatus.Done) {
        color = successColor
    }
    const dataString = action.outputData
    let data: any = JSON.parse(dataString);
    if (!data) {
        data = {}
    }

    return (
        <Grid container spacing={0}>
            {
                !isPending &&
                <>
                    <Grid item xs={6}>
                        <DataValue style={{ color: isDone ? null : errorColor }}>
                            {isDone ? <SuccessIcon fontSize='inherit' /> : <ErrorIcon fontSize='inherit' />}
                            &nbsp;
                            {isDone ? 'Approved' : 'Rejected'}
                            &nbsp;by&nbsp;
                            <UserLink id={data['userId']} name={data['userName']} title={data['userName']} />
                        </DataValue>
                    </Grid>
                    <Grid item xs={6}>
                        <DataValue style={{ color: isDone ? null : errorColor }}>
                            Remarks : <Typography variant='body2'
                                component='span'><i>"{data['remarks']}"</i></Typography>
                        </DataValue>
                    </Grid>
                </>
            }
            <Grid item xs={12}>
                <Box pt={2}>&nbsp;</Box>
            </Grid>
            <Grid item xs={6}>
                {docs.length === 0 ?
                    <Box p={3}>
                        <Alert severity="error">Failed to load documents</Alert>
                    </Box>
                    :
                    <DocumentsList gatewayDocuments={gatewayDocsList} documents={docs} />
                }

            </Grid>
            <Grid item xs={6}>
                <DocumentsChecks {...props} color={color} />
            </Grid>

            <Grid item xs={12}>
                <Grid container spacing={2} alignContent='flex-end' justify='flex-end'>
                    <Grid item>
                        <Button variant="outlined" size="small" color="primary" onClick={previewDocs}>
                            Preview
                        </Button>
                    </Grid>
                    {
                        isPending &&
                        <Grid item>
                            <Button variant="outlined" size="small" color="primary" onClick={verifyDocs}>
                                Verify
                            </Button>
                        </Grid>
                    }
                    {
                        isPending &&
                        <Grid item>
                            <Button variant="outlined" size="small" color="primary" onClick={() => setUpdate(true)}>
                                Update Docs
                            </Button>
                        </Grid>
                    }
                </Grid>
                <Preview open={preview} onClose={closePreview} docs={docs} />
                <Verify open={verify}
                    showCheckBoxes={true}
                    onClose={closeVerify}
                    docs={docs}
                    action={props.action}
                    workflowId={props.workflowId}
                    taskName={props.taskName}
                />
                <DocsUpdater
                    open={update}
                    onClose={() => setUpdate(false)}
                    docs={docs}
                    gatewayDocuments={gatewayDocsList}
                    workflow={workflow}
                />
            </Grid>
        </Grid>
    );
}

export default Index;
