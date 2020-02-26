import React, {useState} from 'react';
import {IAction, IDocument, IManualDecision} from "../../../types";
import DocsView from "./DocsView";
import DocumentsDialog from "./DocumentsDialog";
import {createStyles, Grid, makeStyles} from "@material-ui/core";

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import Toast from "../../../../../utils/Toast";
import {hasValue} from "../../../../../components/inputs/inputHelpers";
import {post} from "../../../../../utils/ajax";
import {remoteRoutes} from "../../../../../data/constants";
import {Dispatch} from "redux";
import {useDispatch} from "react-redux";
import {fetchWorkflowAsync, startWorkflowFetch} from "../../../../../data/redux/workflows/reducer";
import {docMetadata} from "./documentsRules";

interface IProps {
    open: boolean
    onClose: () => any
    docs: IDocument[],
    workflowId: string
    taskName: string
    action: IAction,
    showCheckBoxes: boolean
}

const useStyles = makeStyles(() =>
    createStyles({
        fillHeight: {
            height: '100%'
        },
        header: {
            height: 50,
        },
    }),
);

export default function Verify({open, onClose, docs, showCheckBoxes, ...props}: IProps) {
    const classes = useStyles()
    const dispatch: Dispatch<any> = useDispatch();
    const initialState: any = {remarks: ''}
    docMetadata.forEach(it => initialState[it.name] = false)
    const [metaData, setMetaData] = useState<any>(initialState)
    const [loading, setLoading] = useState<boolean>(false)
    const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setMetaData({...metaData, [name]: event.target.checked});
    };
    const handleRemarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMetaData({...metaData, ['remarks']: event.target.value});
    };

    const handleVerify = () => {
        const allChecked = docMetadata.every(it => metaData[it.name])
        const hasRemarks = hasValue(metaData['remarks'])
        if (!allChecked && !hasRemarks) {
            Toast.error("Please enter a remark")
            return
        }
        const data: IManualDecision = {
            caseId: props.workflowId,
            taskName: props.taskName,
            actionName: props.action.name,
            nextSubStatus: allChecked ? props.action.nextStatusSuccess : props.action.nextStatusError,
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
                reloadCase()
                onClose()
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
        <DocumentsDialog onClose={onClose} open={open} small={false}>
            <Grid container spacing={1} className={classes.fillHeight}>
                <Grid item sm={3} className={classes.fillHeight}>
                    <div className={classes.header}>
                        <Typography variant='h5'>Requirements</Typography>
                        <Box mt={1} mb={1} mr={1}>
                            <Divider/>
                        </Box>
                    </div>
                    <Grid container spacing={1}>
                        {showCheckBoxes?
                        <Grid item xs={12}>
                            <FormGroup>
                                {
                                    docMetadata.map(it => <FormControlLabel
                                        key={it.name}
                                        control={
                                            <Checkbox
                                                checked={metaData[it.name]}
                                                onChange={handleChange(it.name)}
                                                value={metaData[it.name]}
                                            />}
                                        label={it.text}
                                    />)
                                }
                            </FormGroup>
                        </Grid>:
                            <Grid item xs={12}>
                                <FormGroup>
                                    <FormControlLabel
                                        label='Approved'
                                        control={
                                            <Checkbox
                                                checked={metaData['approved']}
                                                onChange={handleChange('approved')}
                                                value={metaData['approved']}
                                            />
                                        }
                                    />
                                </FormGroup>
                            </Grid>
                        }

                        <Grid item xs={12}>
                            <Box pr={1}>
                                <TextField
                                    id="remarks-field"
                                    label="Remarks"
                                    fullWidth
                                    multiline
                                    rowsMax="4"
                                    rows='4'
                                    value={metaData['remarks']}
                                    onChange={handleRemarksChange}
                                    margin="none"
                                    variant="outlined"
                                />
                            </Box>
                        </Grid>
                    </Grid>

                    <Box display="flex" flexDirection="row-reverse" pt={1}>
                        <Box p={1}>
                            <Button variant='contained' color='primary' onClick={handleVerify}
                                    disabled={loading}>Submit</Button>
                        </Box>
                        <Box p={1}>
                            <Button variant='contained' color='default' onClick={onClose}
                                    disabled={loading}>Cancel</Button>
                        </Box>
                    </Box>
                </Grid>
                <Grid item sm={9} className={classes.fillHeight}>
                    <Box display="flex" className={classes.fillHeight}>
                        <Box flexShrink={0} className={classes.fillHeight}>
                            <Divider orientation="vertical"/>
                        </Box>
                        <Box width="100%" className={classes.fillHeight} pl={2}>
                            <DocsView docs={docs}/>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

        </DocumentsDialog>
    );
}
