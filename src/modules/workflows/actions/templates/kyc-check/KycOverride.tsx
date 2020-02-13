import React, {useState} from 'react';
import Grid from "@material-ui/core/Grid";
import {IManualDecision} from "../../../types";
import {Button, TextField} from "@material-ui/core";
import {useDispatch} from "react-redux";
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
import {IKycResponse} from "./index";


interface IFormProps {
    onClose: () => any
}

const KycOverride = (props: IFormProps & ITemplateProps) => {

    const dataString = props.action.outputData

    const data: IKycResponse = JSON.parse(dataString);
    const dispatch: Dispatch<any> = useDispatch();
    const [metaData, setMetaData] = useState<any>(data)
    const [loading, setLoading] = useState<boolean>(false)

    const handleTextChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setMetaData({...metaData, [name]: event.target.value});
    };

    const handleCbChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setMetaData({...metaData, [name]: event.target.checked});
    };

    function handleDecision() {
        const hasRemarks = hasValue(metaData['comment'])
        if (!metaData.approved && !hasRemarks) {
            Toast.error("Please enter a remark")
            return
        }
        metaData.checkStatus = 'Passed';
        const data: IManualDecision = {
            caseId: props.workflowId,
            taskName: props.taskName,
            actionName: props.action.name,
            nextSubStatus: metaData.approved ? props.action.nextStatusSuccess : props.action.nextStatusError,
            resumeCase: false,
            override: true,
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
                                checked={metaData['override']}
                                onChange={handleCbChange('override')}
                                value={metaData['override']}
                            />
                        }
                    />
                </FormGroup>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Remarks"
                    fullWidth
                    multiline
                    rowsMax="3"
                    rows='3'
                    value={metaData['comment']}
                    onChange={handleTextChange('comment')}
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
                            Override
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}


export default KycOverride;
