import React, {useState} from 'react';
import Grid from "@material-ui/core/Grid";
import {ActionStatus, IAction} from "../../../types";
import DataValue from "../../../../../components/DataValue";
import {getInitials} from "../../../../../utils/stringHelpers";
import UserLink from "../../../../../components/UserLink";
import {errorColor, successColor} from "../../../../../theme/custom-colors";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import {Button, TextField} from "@material-ui/core";
import EditDialog from "../../../../../components/EditDialog";


interface IFormProps {
    onClose:()=>any
}
const VerifyForm = (props:IFormProps) => {
    function handleApprove() {

    }

    function handleReject() {

    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <TextField
                    label="Remarks"
                    id="margin-normal"
                    helperText="Add extra remarks"
                    margin="normal"
                />
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={2} alignContent='flex-end' justify='flex-end'>
                    <Grid item>
                        <Button variant="outlined" size="small" color="default" onClick={handleReject}>
                            Reject
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" size="small" color="primary" onClick={handleApprove}>
                            Approve
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

interface IProps {
    action: IAction
}

const Index = ({action}: IProps) => {
    const [open, setOpen] = useState<boolean>(false)
    const dataString = action.outputData
    const data: any = dataString ? JSON.parse(dataString) : {};

    function handleClick() {
        setOpen(true)
    }
    function handleClose() {
        setOpen(false)
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
                            <VerifyForm onClose={handleClose}/>
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
