import React from 'react';
import {ActionStatus, IAction} from "../../types";
import RawData from "./RawData";
import Error from "./error";
import Pending from "./pending";
import Grid from "@material-ui/core/Grid";
import {getRandomStr} from "../../../../utils/stringHelpers";
import SimpleTable from "../../../../components/SimpleTable";

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

const OutstandingLoans = ({action}: IProps) => {
    if (action.status === ActionStatus.Error) {
        return <Error action={action}/>
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
    return (
        <Grid container>
            <Grid item xs={12}>
                <SimpleTable titles={titles} data={data}/>
            </Grid>
            <Grid item xs={12}>
                <RawData action={action}/>
            </Grid>
        </Grid>
    );
}


export default OutstandingLoans;

