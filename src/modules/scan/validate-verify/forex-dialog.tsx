import React, {ChangeEvent, useEffect, useState} from 'react'

import Grid from "@material-ui/core/Grid";
import {Form, Formik} from "formik";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import {createStyles, makeStyles} from "@material-ui/core";

import TextField from "@material-ui/core/TextField";
import {Dispatch} from "redux";
import {useDispatch} from "react-redux";
import {actionIForexValue} from "../../../data/redux/forex/reducer";
import {IForex} from "../../transfers/types";


const useStyles = makeStyles(() =>
    createStyles({
        submissionGrid: {
            marginTop: 35
        },
        submissionBox: {
            display: 'flex',
            justifyContent: 'space-between'
        },
        rejectButton: {
            backgroundColor: '#b32121',
            color: 'white'
        }
        ,

        field: {
            padding: 10
        }


    })
);

interface IProps {
    data: any;
    handleDialogCancel: () => any
    handleSubmission: () => any
    isSubmitBtnDisabled: boolean
    isCancelBtnDisabled: boolean
    children?: any
}

const ForexForm = ({data, handleDialogCancel, handleSubmission, isSubmitBtnDisabled, isCancelBtnDisabled}: IProps) => {

    const classes = useStyles()

    const [rate, setRate] = useState('')
    const [remittanceAmount, setRemittanceAmount] = useState('')
    const initialData: IForex = {
        rate,
        remittanceAmount
    }

    const [theData, setTheData] = useState(initialData)

    const dispatch: Dispatch<any> = useDispatch()

    useEffect(() => {

    }, [])

    function handleRateChange(e: ChangeEvent<HTMLInputElement>) {
        // setRate(e.target.value)
        initialData.rate = e.target.value
    }

    function handleRemittanceAmountChange(e: ChangeEvent<HTMLInputElement>) {
        // setRemittanceAmount(e.target.value)
        initialData.remittanceAmount = e.target.value
    }

    function handleConfirmation() {
        console.log("severe:", theData)
        console.log("severe-2:", initialData)

        dispatch(actionIForexValue(initialData))

        handleDialogCancel()
    }

    return <Grid item sm={12}>

        <Formik

            enableReinitialize

            initialValues={initialData}
            onSubmit={async (values) => {
                await new Promise(resolve => {
                    setTimeout(resolve, 500)
                    console.log("sub value: ", values)
                    setTheData(values)
                    handleConfirmation()
                    // alert(`ale-2${JSON.stringify(data, null, 2)}:`);
                });

            }}
        >
            <Form>

                <Grid>

                    <Box className={classes.submissionBox}>

                        <TextField onChange={handleRateChange} className={classes.field} label="Rate" variant="outlined"/>

                    </Box>

                    <Box className={classes.submissionBox}>

                        <TextField onChange={handleRemittanceAmountChange} className={classes.field} label="Remittance amount" variant="outlined"/>

                    </Box>

                </Grid>

                <Grid item sm={12} className={classes.submissionGrid}>

                    <Box className={classes.submissionBox}>

                        <Button variant="contained" className={classes.rejectButton} disabled={isCancelBtnDisabled} onClick={handleDialogCancel}>Cancel</Button>
                        <Button type="submit" variant="contained" color="primary" disabled={isSubmitBtnDisabled} onSubmit={handleConfirmation}>Confirm</Button>

                    </Box>
                </Grid>
            </Form>
        </Formik>

    </Grid>
}

export default ForexForm