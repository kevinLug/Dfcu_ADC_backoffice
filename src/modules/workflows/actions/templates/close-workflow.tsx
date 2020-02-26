import React, {useState} from 'react';
import Grid from "@material-ui/core/Grid";
import {ActionStatus, canRunAction, IWorkflow} from "../../types";
import DataValue from "../../../../components/DataValue";
import {getInitials} from "../../../../utils/stringHelpers";
import UserLink from "../../../../components/links/UserLink";
import {errorColor, successColor} from "../../../../theme/custom-colors";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import {Button} from "@material-ui/core";
import EditDialog from "../../../../components/EditDialog";
import Pending from "./pending";
import {useSelector} from "react-redux";
import ITemplateProps from "./ITemplateProps";
import RemarksForm from "./RemarksForm";


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
                                Close Workflow
                            </Button>
                        </Grid>
                        <EditDialog open={open} onClose={handleClose} title='Close Workflow'>
                            <RemarksForm onClose={handleClose} {...props}/>
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
