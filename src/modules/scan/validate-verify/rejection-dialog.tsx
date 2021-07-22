import React from 'react'
import EditDialog from "../../../components/EditDialog";
import Grid from "@material-ui/core/Grid";
import {Form, Formik} from "formik";
import RejectionRemarks from "./rejection-remarks";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import {IRemarks} from "./rejection-remarks-values";
import {createStyles, makeStyles} from "@material-ui/core";


const useStyles = makeStyles(() =>
    createStyles({
        submissionGrid: {
            marginTop: 35
        },
        submissionBox: {
            display: 'flex',
            justifyContent: 'space-between',
            marginRight:10
        },
        rejectButton: {
            backgroundColor: '#b32121',
            color: 'white'
        },
        hiddenBtn: {
            display: 'none !important'
        },
        form:{
            padding: 10,
            margin: 10
        },

    })
);

interface IProps {
    data: any;
    remarks: IRemarks
    handleDialogCancel: () => any
    isSubmitBtnDisabled: boolean
    isCancelBtnDisabled: boolean
    handleSubmission: () => any
    children?: any
}

const RejectionForm = ({data, remarks, handleDialogCancel, isSubmitBtnDisabled, isCancelBtnDisabled, handleSubmission}: IProps) => {

    const classes = useStyles()

    return <Grid  container >

        <Formik

            enableReinitialize

            initialValues={data}
            onSubmit={async () => {
                await new Promise(resolve => {
                    setTimeout(resolve, 500)
                    // console.log("sub value: ", values)
                    handleSubmission()
                    // alert(`ale-2${JSON.stringify(data, null, 2)}:`);
                });

            }}
        >
            <Form className={classes.form}>

                <RejectionRemarks remarks={remarks.remarks} role={remarks.role}/>

                <Grid item sm={12} className={classes.submissionGrid} >

                    <Grid className={classes.submissionBox}>

                        <Grid item sm={3} >
                            <Button variant="contained" className={classes.rejectButton} disabled={isCancelBtnDisabled} onClick={handleDialogCancel}>Cancel</Button>
                        </Grid>

                        <Grid item sm={5}>
                            <Button type="submit" variant="contained" color="primary" disabled={isSubmitBtnDisabled} onSubmit={handleSubmission}>Confirm</Button>
                        </Grid>


                    </Grid>

                </Grid>
            </Form>
        </Formik>

    </Grid>
}

export default RejectionForm