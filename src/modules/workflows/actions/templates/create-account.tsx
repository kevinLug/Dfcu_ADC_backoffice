import React, {useState} from 'react';
import Grid from "@material-ui/core/Grid";
import {ActionStatus, IAction, IWorkflow} from "../../types";
import Error from "./error";
import Pending from "./pending";
import Typography from "@material-ui/core/Typography";
import DataValue from "../../../../components/DataValue";
import IconLabel from "../../../../components/IconLabel";
import {DateIcon, SuccessIcon} from "../../../../components/xicons";
import {printDateTime} from "../../../../utils/dateHelpers";
import Collapse from "@material-ui/core/Collapse";
import {Box} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import DetailView, {IRec} from "../../../../components/DetailView";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import UserLink from "../../../../components/links/UserLink";
import {IKycResponse} from "./kyc-check";
import ITemplateProps from "./ITemplateProps";



interface IAccount {
    cifId: string,
    accountNumber: string,
}
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

const fields = (data: IWorkflow): IRec[] => {
    const metaData:any = data.caseData.metaData;

    const recs = [
        {
            label: 'currency',
            value: metaData.currency
        },
        {
            label: 'Request Atm Card',
            value: renderCheck(metaData.requestAtmCard)
        },
        {
            label: 'Request Cheque Book',
            value: renderCheck(metaData.requestChequeBook)
        },
        {
            label: 'Request Quick Banking',
            value: renderCheck(metaData.requestQuickBanking)
        },
    ]
    return recs;
}

const renderCheck=(dt:any)=> dt?"Yes":"No"

const CreateAccount = ({action,workflow}: ITemplateProps) => {
    const classes = useStyles()
    const [open, setOpen] = useState(false)

    function toggleIo(e: any) {
        e.preventDefault()
        setOpen(!open)
    }
    if (action.status === ActionStatus.Error) {
        return <Error action={action}/>
    }
    if (action.status === ActionStatus.Pending) {
        return <Pending text="Pending Execution"/>
    }
    const dataString = action.outputData
    const data: IAccount = JSON.parse(dataString);
    const request: any = JSON.parse(action.inputData);
    return (
        <Grid container>
            <Grid item xs={12} sm={6} md={4}>
                <DataValue>{request.acctName}&nbsp;<Typography variant='caption'>(Account Name)</Typography></DataValue>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <IconLabel icon={
                    <SuccessIcon fontSize='inherit'/>
                } label={data.accountNumber}/>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <IconLabel icon={<DateIcon fontSize='inherit'/>} label={printDateTime(action.runDate)}/>
            </Grid>
            <Grid item xs={12} md={1}>
                <a href='/' className={classes.link} onClick={toggleIo}>{open ? '- Less' : '+ More'}</a>
            </Grid>
            <Grid item xs={12}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box pt={1}>
                        <Divider/>
                        <Box pt={1}>{
                            workflow&&
                            <DetailView data={fields(workflow!)} columns={2}/>
                        }
                        </Box>
                    </Box>
                </Collapse>
            </Grid>
        </Grid>
    );
}

export default CreateAccount;
