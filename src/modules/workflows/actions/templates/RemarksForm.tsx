import React, {useState} from 'react';
import ITemplateProps from "./ITemplateProps";
import {Dispatch} from "redux";
import {useDispatch} from "react-redux";
import {hasValue} from "../../../../components/inputs/inputHelpers";
import Toast from "../../../../utils/Toast";
import {IManualDecision} from "../../types";
import {post} from "../../../../utils/ajax";
import {remoteRoutes} from "../../../../data/constants";
import {fetchWorkflowAsync, startWorkflowFetch} from "../../../../data/redux/workflows/reducer";
import Grid from "@material-ui/core/Grid";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import {Button, TextField} from "@material-ui/core";

interface IProps {
    onClose: () => any
}

const RemarksForm = (props: IProps & ITemplateProps) => {
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
                        <Button variant="outlined" size="small" color="primary" onClick={handleDecision}
                                disabled={loading}>
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}


export default RemarksForm;
