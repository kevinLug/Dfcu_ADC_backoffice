import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles, Theme, createStyles, Modal, Typography, Box } from '@material-ui/core';

import { wfInitialSort, workflowHeadCellsNew, workflowTypes } from "../workflows/config";
import XTable from "../../components/table/XTable";

const useStyles = makeStyles(theme => ({
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
    },
    paper: {
        position: "absolute",
        width: '80%',
        height: 'auto',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(4),
        outline: "none"
    }
}));

function getModalStyle() {

    return {
        top: `20%`,
        bottom: `20%`,
        left: `$10%`,
        right: `10%`,
        height: '70%'
    };
}

interface IProps {
    shouldOpen: boolean;
    title: string
    messages: string[]
    children?: any,
    data: any,
    stopTransactionProcess?: (data?: any) => any
    continueTransactionProcess: (data?: any) => any
}

export default function PotentialDuplicatesDialog({ shouldOpen, continueTransactionProcess, title, data, messages, stopTransactionProcess, children }: IProps) {
    const classes = useStyles();
    const [open, setOpen] = useState(shouldOpen);
    const [modalStyle] = useState(getModalStyle);
    const handleClose = () => {
        setOpen(false);
    };

    function content() {
        return children
    }

    function stopProcess() {
        if (stopTransactionProcess) {
            stopTransactionProcess()
        }

        handleClose()

        window.location.reload();

    }

    function continueProcess() {

        continueTransactionProcess()

        handleClose()

    }

    return (
        <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClose={handleClose}
            title="Potential Duplicates"
            disableBackdropClick={true}
            disableEscapeKeyDown={true}
        >

            <div style={modalStyle} className={classes.paper}>
                <Typography variant="h6" id="modal-title">
                    Potential Duplicates
                </Typography>

                <XTable
                    // loading={loadingNew}
                    headCells={workflowHeadCellsNew}
                    data={data}
                    initialRowsPerPage={5}
                    usePagination={true}
                    // onFilterToggle={handleFilterToggle}
                    initialSortBy={wfInitialSort}
                    initialOrder="desc"
                />
                <Box className={classes.submissionBox}>

                    <Button type="submit" variant="contained" color="primary" onClick={continueProcess}>Continue Transaction</Button>
                    <Button variant="contained" hidden={false} className={classes.rejectButton} onClick={stopProcess}>Cancel Transaction</Button>

                </Box>

            </div>
        </Modal>

    );
}
