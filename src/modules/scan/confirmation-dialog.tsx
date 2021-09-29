import React from 'react'

import Grid from "@material-ui/core/Grid";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import {createStyles, makeStyles} from "@material-ui/core";
import EditDialog from '../../components/EditDialog';

const useStyles = makeStyles(() =>
    createStyles({
        submissionGrid: {
            marginTop: 0
        },
        submissionBox: {
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 20,
            marginBottom: 10
        },
        rejectButton: {
            backgroundColor: '#b32121',
            color: 'white'
        }

    })
);

interface IProps {
    title: string;
    data?: any;
    handleDialogCancel: () => any
    handleConfirmation: () => any
    children?: any
}

const ConfirmationDialog = ({title, handleDialogCancel, handleConfirmation, children}: IProps) => {

    const classes = useStyles()

    return <EditDialog open={true}

                       onClose={() => {
                       }}

                       disableBackdropClick={false}
                       title={title}>
        <Grid item sm={12}>

            <Grid item sm={12} className={classes.submissionGrid}>

                {children}

                <Box className={classes.submissionBox}>

                    <Button type="submit" variant="contained" color="primary" onClick={handleConfirmation}>OK</Button>
                    <Button variant="contained" className={classes.rejectButton} onClick={handleDialogCancel}>Cancel</Button>

                </Box>

            </Grid>


        </Grid>
    </EditDialog>


}

export default ConfirmationDialog