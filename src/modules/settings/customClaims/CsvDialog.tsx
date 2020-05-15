import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

interface IProps {
    open: boolean
    onClose: () => any
    children?: any
}

const CsvDialog = (props: IProps) => {
    const {onClose, open} = props;
    return (
        <Dialog onClose={onClose} aria-labelledby="CSV dialog" open={open} maxWidth="lg" fullWidth>
            <DialogTitle id="csv-dialog-title">CSV Importer</DialogTitle>
            <DialogContent>
                {props.children}
            </DialogContent>
        </Dialog>
    );
}

export default CsvDialog;
