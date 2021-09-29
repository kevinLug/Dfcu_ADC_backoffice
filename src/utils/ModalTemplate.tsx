import React from 'react'
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {Dialog, DialogContent, Theme, useTheme, Button, DialogActions} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            //width: window.innerWidth * 0.8,
            //maxWidth: '100%',
            // height: window.innerHeight * 0.9
            width: '100%'
        }
    }),
);

interface IProps {
    open: boolean;
    onClose: () => any;
    children?: any;
    showDialogActions?: boolean
}

const ModalDialog = ({open, onClose, children, showDialogActions = true}: IProps) => {
    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [openDialog, setOpenDialog] = React.useState(false);

    const handleClose = () => {
        if(open){
            open = false
        }
    };

    return (
        <Dialog open={open} classes={{paper: classes.root}} aria-labelledby="modal-dialog" fullScreen={fullScreen} >

            <DialogContent style={{height: '100%'}}>
                {children}
                <DialogActions>
                    <Button autoFocus onClick={onClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </DialogContent>

        </Dialog>
    );
}

export default ModalDialog