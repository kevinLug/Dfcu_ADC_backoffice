import React, {useState} from 'react';
import {ActionStatus, IAction} from "../../../types";
import Error from "../error";
import Pending from "../pending";
import Grid from "@material-ui/core/Grid";
import {printDate, printDateTime} from "../../../../../utils/dateHelpers";
import DataValue from "../../../../../components/DataValue";
import {ContactCategory, getPhone, IContact, renderName, toTitleCase} from "../../../../contacts/types";
import ContactLink from "../../../../../components/links/ContactLink";
import {DateIcon, ErrorIcon, SuccessIcon} from "../../../../../components/xicons";
import IconLabel from "../../../../../components/IconLabel";
import Collapse from '@material-ui/core/Collapse';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import DetailView, {IRec} from "../../../../../components/DetailView";
import {Box} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import EditDialog from "../../../../../components/EditDialog";
import KycOverride from "./KycOverride";
import ITemplateProps from "../ITemplateProps";



const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        link: {
            color: theme.palette.primary.main,
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'underline',
            },
        }
    }),
);


export enum IKycStatus {
    NotRun = 'NotRun', InProgress = 'InProgress', Passed = 'Passed', NotPassed = 'NotPassed', Error = '', Override = 'Error'
}

interface IKycResponse {
    id: string
    referenceId: string
    checkType: string
    checkStatus: IKycStatus
    value?: string
    comment?: string
    data: any
    runDate?: string
}

const fields = (data: IKycResponse): IRec[] => {
    return [
        {
            label: 'Check Type',
            value: data.checkType
        },
        {
            label: 'Check Status',
            value: data.checkStatus
        },
        {
            label: 'Result',
            value: data.value
        },
        {
            label: 'Remarks',
            value: data.comment
        }
    ]

}


const hasError = (outData: string): boolean => {
    try {
        const data: IKycResponse = JSON.parse(outData);
        return !data.checkStatus
    } catch (e) {
        return true
    }
}

const Index = ({action,...rest}: ITemplateProps) => {

    const [open, setOpen] = useState(false)
    const [dialog, setDialog] = useState(false)
    const classes = useStyles()

    function toggleIo(e: any) {
        e.preventDefault()
        setOpen(!open)
    }

    function handleOverride(e: any) {
        e.preventDefault()
        setDialog(true)
    }
    function handleCloseOverride() {

        setDialog(false)
    }

    if (action.status === ActionStatus.Pending) {
        return <Pending text="Pending Execution"/>
    }
    const dataString = action.outputData
    if (action.status === ActionStatus.Error && hasError(dataString)) {
        return <Error action={action}/>
    }
    const data: IKycResponse = JSON.parse(dataString);
    const contact: any = JSON.parse(action.inputData);
    contact.category = ContactCategory.Person
    return (
        <Grid container>
            <Grid item xs={12} md={4}>
                <DataValue><ContactLink id={contact.id} name={toTitleCase(renderName(contact))}/></DataValue>
            </Grid>
            <Grid item xs={12} md={4}>
                <Box display="flex">
                    <Box >
                        <IconLabel icon={
                            data.checkStatus === IKycStatus.Passed ?
                                <SuccessIcon fontSize='inherit'/> :
                                <ErrorIcon fontSize='inherit'/>
                        } label={`${data.checkStatus}/${data.value}`}/>
                    </Box>
                    {
                        data.checkStatus !== IKycStatus.Passed&&
                        <Box pl={1} style={{marginTop:2}}>
                            <a href='/' className={classes.link} onClick={handleOverride}>Override</a>
                        </Box>
                    }
                </Box>
            </Grid>
            <Grid item xs={12} md={3}>
                <IconLabel icon={<DateIcon fontSize='inherit'/>} label={printDateTime(data.runDate)}/>
            </Grid>
            <Grid item xs={12} md={1}>
                <a href='/' className={classes.link} onClick={toggleIo}>{open ? '- Less' : '+ More'}</a>
            </Grid>
            <Grid item xs={12}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box pt={1}>
                        <Divider/>
                        <Box pt={1}>
                        <DetailView data={fields(data)} columns={2}/>
                        </Box>
                    </Box>
                </Collapse>
            </Grid>
            <EditDialog open={dialog} onClose={handleCloseOverride} title='Override check'>
                <KycOverride onClose={handleCloseOverride} action={action} {...rest}/>
            </EditDialog>
        </Grid>
    );
}


export default Index;
