import React from 'react';
import {createStyles, makeStyles, Theme, useTheme} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            //width: window.innerWidth * 0.8,
            //maxWidth: '100%',
            height: window.innerHeight * 0.9
        }
    }),
);

interface IProps {
    open: boolean
    onClose: () => any
    children?:any
    small:boolean
}

export default function DocumentsDialog({open, onClose, children,small}: IProps) {
    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <Dialog onClose={onClose} aria-labelledby="document-preview-dialog" open={open} classes={{
            paper: classes.root
        }} fullScreen={fullScreen} fullWidth maxWidth={small?'md':'lg'}>
            <DialogContent style={{height: '100%'}}>
                {children}
            </DialogContent>
        </Dialog>
    );
}

