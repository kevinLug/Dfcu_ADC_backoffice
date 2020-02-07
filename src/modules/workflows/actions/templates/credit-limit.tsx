import React from 'react';
import {createStyles, makeStyles} from "@material-ui/core";
import RawData from "./RawData";
import {ActionStatus, IAction} from "../../types";
import Error from "./error";
import Pending from "./pending";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import DetailView, {IRec} from "../../../../components/DetailView";
import {printMoney} from "../../../../utils/numberHelpers";
import {getRandomStr} from "../../../../utils/stringHelpers";
import SimpleTable from "../../../../components/SimpleTable";
import DataValue from "../../../../components/DataValue";

interface IProps {
    action: IAction
}

interface ICreditInformation {
    creditLimit: number
    minimumAmount: number
    grade: string
    remarks: string
}

interface IRepaymentPlan {
    id: string
    period: number
    timeUnit: string
    interestRate: number
}

interface ICreditLimit {
    creditInformation: ICreditInformation
    repaymentPlans: IRepaymentPlan[]
}

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: '100%'
        }
    }),
);

interface ITitle {
    name: string
    title: string
}

const CreditLimit = ({action}: IProps) => {
    const classes = useStyles()
    if (action.status === ActionStatus.Error) {
        return <Error action={action}/>
    }
    if (action.status === ActionStatus.Pending) {
        return <Pending text="Pending Execution"/>
    }
    const dataString = action.outputData
    const data: ICreditLimit = JSON.parse(dataString);
    const fields: IRec[] = [
        {
            label: "Credit Limit",
            value: printMoney(data.creditInformation.creditLimit)
        },
        {
            label: "Minimum",
            value: printMoney(data.creditInformation.minimumAmount)
        },
        {
            label: "Grade",
            value: data.creditInformation.grade
        },
        {
            label: "Remarks",
            value: <DataValue ><i>"{data.creditInformation.remarks}"</i></DataValue>
        }
    ]

    const repaymentPlans = data.repaymentPlans.map(it => ({...it, id: getRandomStr()}))
    const titles: ITitle[] = [
        {name: 'period', title: 'Period'},
        {name: 'timeUnit', title: 'Time Unit'},
        {name: 'interestRate', title: 'Interest'},
    ]
    return (
        <div className={classes.root}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <DataValue>Identification</DataValue>
                    <Divider/>
                    <DetailView data={fields}/>
                </Grid>
                <Grid item xs={6}>
                    <DataValue>Repayment Plan</DataValue>
                    <Divider/>
                    <SimpleTable data={repaymentPlans} titles={titles}/>
                </Grid>
            </Grid>
            <RawData action={action}/>
        </div>
    );
}
export default CreditLimit;
