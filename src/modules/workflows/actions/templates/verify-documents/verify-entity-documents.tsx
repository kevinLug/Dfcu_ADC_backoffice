import React, {useState} from 'react';
import Grid from "@material-ui/core/Grid";
import InfoIcon from "@material-ui/icons/Info";
import FileFilledIcon from "@material-ui/icons/InsertDriveFile";
import FileOutlinedIcon from "@material-ui/icons/InsertDriveFileOutlined";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import {ActionStatus, canRunAction, IManualDecision} from "../../../types";
import DataValue from "../../../../../components/DataValue";
import {Flex} from "../../../../../components/widgets";
import {errorColor, successColor, warningColor} from "../../../../../theme/custom-colors";
import {Button, TextField} from "@material-ui/core";
import Preview from "./Preview";
import Verify from "./Verify";
import ITemplateProps from "../ITemplateProps";
import {docMetadata} from "./documentsRules";
import Box from "@material-ui/core/Box";
import {useDispatch, useSelector} from "react-redux";
import Pending from "../pending";
import Typography from "@material-ui/core/Typography";
import {AccountCategory, IState} from "../../../../../data/types";
import {hasNoValue, hasValue} from "../../../../../components/inputs/inputHelpers";
import {Dispatch} from "redux";
import Toast from "../../../../../utils/Toast";
import {post} from "../../../../../utils/ajax";
import {remoteRoutes} from "../../../../../data/constants";
import {fetchWorkflowAsync, startWorkflowFetch} from "../../../../../data/redux/workflows/reducer";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import DocumentsList from "./DocumentsList";
import UserLink from "../../../../../components/links/UserLink";
import {getInitials} from "../../../../../utils/stringHelpers";
import {ErrorIcon, SuccessIcon} from "../../../../../components/xicons";

const getDocs = (category: string, product: string, accountCategories: AccountCategory[]) => {
    const categoryArr = accountCategories.filter(it => it.code.toLocaleLowerCase() === category.toLocaleLowerCase())
    if (hasNoValue(categoryArr) || hasNoValue(categoryArr[0])) {
        return []
    }
    const categoryObj = categoryArr[0]

    const accountArr = categoryObj.accounts.filter(it => it.code.toLocaleLowerCase() === product.toLocaleLowerCase())
    if (hasNoValue(accountArr) || hasNoValue(accountArr[0])) {
        return []
    }
    const account = accountArr[0]
    return account.documents
}



const EntityVerifyDocuments = (props: ITemplateProps) => {
    const {action, taskName} = props
    const workflow = useSelector((state: any) => state.workflows.workflow)
    const metadata = useSelector((state: IState) => state.core.metadata)
    const docs = workflow.documents
    const reqDocs = getDocs(workflow.type, workflow.metaData.product, metadata.accountCategories)
    const canRun = canRunAction(action.name, taskName, workflow)
    const [preview, setPreview] = useState(false)
    const [verify, setVerify] = useState(false)

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
        return <Pending text="Pending Execution"/>
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
                        <DataValue style={{color: isDone ? null : errorColor}}>
                            {isDone ? <SuccessIcon fontSize='inherit'/> : <ErrorIcon fontSize='inherit' />}
                            &nbsp;
                            {isDone ? 'Approved' : 'Rejected'}
                            &nbsp;by&nbsp;
                            <UserLink id={data['userId']} name={getInitials(data['userName'])} title={data['userName']}/>
                        </DataValue>
                        <Box pt={1} pl={2}>
                            <DataValue style={{color: isDone ? null : errorColor}}>
                                Remarks : <Typography variant='body2' component='span'><i>"{data['remarks']}"</i></Typography>
                            </DataValue>
                        </Box>

                    </Grid>
                </>
            }
            <Grid item xs={6}>
                <DocumentsList documents={reqDocs}/>
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
                </Grid>
                <Preview open={preview} onClose={closePreview} docs={docs}/>

                <Verify open={verify}
                        showCheckBoxes={false}
                        onClose={closeVerify}
                        docs={docs}
                        action={props.action}
                        workflowId={props.workflowId}
                        taskName={props.taskName}
                />
            </Grid>
        </Grid>
    );
}

export default EntityVerifyDocuments;
