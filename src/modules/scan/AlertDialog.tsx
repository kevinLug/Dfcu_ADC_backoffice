import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface IProps {
    shouldOpen: boolean;
    title: string
    messages: string[]
}

export default function AlertDialogForMessages({shouldOpen, title, messages}: IProps) {
    const [open, setOpen] = React.useState(shouldOpen);

    const handleClose = () => {
        setOpen(false);
    };

    function content() {
        return messages.map((m, index) => {
            return <li key={index} >{m}</li>
        })
    }

    return (
        <div>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {
                            content()
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {/*<Button onClick={handleClose} color="primary">*/}
                    {/*    Disagree*/}
                    {/*</Button>*/}
                    <Button onClick={handleClose} color="primary" autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
