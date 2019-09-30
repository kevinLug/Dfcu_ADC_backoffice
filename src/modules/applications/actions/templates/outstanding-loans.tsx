import React from 'react';
import {createStyles, makeStyles, Theme, Typography} from "@material-ui/core";
import {ActionStatus, IAction} from "../../types";
import RawData from "./RawData";
import Error from "./error";
import Pending from "./pending";
import Grid from "@material-ui/core/Grid";
import {printDateTime} from "../../../../utils/dateHelpers";
import {getRandomStr} from "../../../../utils/stringHelpers";

interface IProps {
    action: IAction
}

interface ILoan {
    id: string
    type: string
    amount: string
    period: string
    timeUnit: string
    interestRate: string
}

interface ITitle {
    name: string
    title: string
}


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%'
        },
        row: {},
        col: {
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
        }
    }),
);

const OutstandingLoans = ({action}: IProps) => {
    const classes = useStyles()
    if (action.status === ActionStatus.Error) {
        return <Error text={action.statusMessage}/>
    }
    if (action.status === ActionStatus.Pending) {
        return <Pending text="Pending Execution"/>
    }
    const dataString = action.outputData
    let data: ILoan[] = JSON.parse(dataString);
    data = data.map(it => ({...it, id: getRandomStr()}))
    const titles: ITitle[] = [
        {name: 'type', title: 'Type'},
        {name: 'amount', title: 'Amount'},
        {name: 'period', title: 'Period'},
        {name: 'timeUnit', title: 'Time Unit'},
        {name: 'interestRate', title: 'Interest'},
    ]
    console.log("Data", {dataString, data})
    return (
        <Grid container>
            <Grid item xs={12}>
                <table className={classes.root}>
                    <tbody>
                    <tr>
                        {
                            titles.map(it => (
                                <td key={it.name}>
                                    <Typography variant='caption'>
                                        <b>{it.title}</b>
                                    </Typography>
                                </td>
                            ))
                        }
                    </tr>
                    {
                        data.map((row: any) => {
                            console.log("Row>>>>", row)
                            return (
                                <tr key={row.id}>
                                    {
                                        titles.map(it => (
                                            <td key={it.name}>
                                                <Typography>
                                                    {row[it.name]}
                                                </Typography>
                                            </td>
                                        ))
                                    }
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table>
            </Grid>
            <Grid item xs={12}>
                <RawData action={action}/>
            </Grid>
        </Grid>
    );
}


export default OutstandingLoans;

