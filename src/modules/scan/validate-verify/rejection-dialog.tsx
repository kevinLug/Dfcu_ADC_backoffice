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
            justifyContent: 'space-between'
        },
        rejectButton: {
            backgroundColor: '#b32121',
            color: 'white'
        }

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

    return <Grid item sm={12}>

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
            <Form>

                <RejectionRemarks remarks={remarks.remarks} role={remarks.role}/>

                <Grid item sm={12} className={classes.submissionGrid}>

                    <Box className={classes.submissionBox}>

                        <Button variant="contained" className={classes.rejectButton} disabled={isCancelBtnDisabled} onClick={handleDialogCancel}>Cancel</Button>
                        <Button type="submit" variant="contained" color="primary" disabled={isSubmitBtnDisabled} onSubmit={handleSubmission}>Confirm</Button>

                    </Box>

                </Grid>
            </Form>
        </Formik>

    </Grid>
}

export default RejectionForm