import React, {useEffect} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            position: 'absolute',
            width: 400,
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
    }),
);

interface IProps {
    imgStr: string
    shouldOpen:boolean;
}

export default function ForexDetailFileViewOnDemand({imgStr, shouldOpen}: IProps) {
    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(shouldOpen);

    useEffect(() => {

    },[open])

    const handleOpen = () => {
        console.log("inside opening...")
        setOpen(shouldOpen);
    };

    const handleClose = () => {
        setOpen(false);
        console.log("inside closing...", open)
    };

    const body = (
        <div style={modalStyle} className={classes.paper}>

            <img src={imgStr}/>

            {/*<h2 id="simple-modal-title">Text in a modal</h2>*/}
            {/*<p id="simple-modal-description">*/}
            {/*    Duis mollis, est non commodo luctus, nisi erat porttitor ligula.*/}
            {/*</p>*/}
            {/*<ForexDetailFileViewOnDemand/>*/}
        </div>
    );

    return (
        <div>
            <button type="button" onClick={handleOpen}>
                Open Modal
            </button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {body}
            </Modal>
        </div>
    );
}
