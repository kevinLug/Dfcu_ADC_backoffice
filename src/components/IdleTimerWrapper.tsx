import React, { useRef, useState } from 'react';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import IdleTimer from 'react-idle-timer';
// import DeleteDialog from '../components/DeleteDialog'
import TimeoutIcon from '../assets/timeout.png'
import { handleLogout } from '../data/redux/coreActions'
import authService from '../data/oidc/AuthService';
import { useDispatch, useSelector } from 'react-redux';
// import { verificationRequestConstants } from '../data/redux/ninVerification/reducer';
import { IState } from '../data/types';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        continueButton: {
            color: "white",
            backgroundColor: '#065fd4',
            padding: "3px 29px",
            "&:hover": {
                backgroundColor: '#065fd4',
            },
            width: 180,
        },
        trashContainerClass: {
            textAlign: "center",
            lineHeight: 2,
            marginTop: 5,
        },
        trash: {
            width: 56,
        },

    })
);


const IdleTimerWrapper = () => {
    // const classes = useStyles();
    // const dispatch = useDispatch();
    // const [popUpOpen, setPopUp] = useState(false)
    // const InitialtimeToLogout = 20;//time in seconds
    // const [timeRemaining, setTimeRemaining] = useState(InitialtimeToLogout)
    // const deactivateText =
    //     "For security reasons, your connection timesout after you've been inactive for a while. Click continue to stay signed in.";
    // const isFormOpen = useSelector((state: IState) => state.verificationRequests.addNew);
    //
    // const idleTime = 1000 * 60 * 5;
    // const idleTimerRef = useRef(null);
    // const sessionTimeoutRef: any = useRef(null);
    // const setTimeRef: any = useRef();
    // const setToogleRef: any = useRef();
    //
    // const onIdle = () => {
    //     if (isFormOpen) {
    //         dispatch({
    //             type: verificationRequestConstants.RequestsAddNew,
    //             payload: false,
    //         });
    //         dispatch({
    //             type: verificationRequestConstants.TurnOnSlideout,
    //             payload: false,
    //         });
    //     }
    //
    //     setPopUp(true)
    //     countDown()
    //
    // }
    // function handleCancel() {
    //     setPopUp(false);
    // }
    //
    // function handleContinue() {
    //     clearTimeout(setToogleRef.current)
    //     document.title = 'BOU National ID Verification'
    //     setPopUp(false);
    //     clearTimeout(sessionTimeoutRef.current)
    //     // reset cout down time
    //     setTimeRemaining(InitialtimeToLogout)
    //     clearInterval(setTimeRef.current);
    // }
    // async function doLogout() {
    //     dispatch(handleLogout());
    //     await authService.logout();
    //     clearInterval(setTimeRef.current)
    // }
    //
    // const countDown = () => {
    //     let timeToCountDown = 20
    //     //Toggle title
    //     setToogleRef.current = setInterval(() => {
    //         if (document.title === 'BOU National ID Verification') {
    //             document.title = 'You are about to be logged out'
    //         } else {
    //             document.title = 'BOU National ID Verification'
    //         }
    //     }, 2000)
    //
    //     setTimeRef.current = setInterval(function () {
    //         timeToCountDown -= 1;
    //         setTimeRemaining(timeToCountDown)
    //         if (timeToCountDown === 0) {
    //             // reset cout down time
    //             setTimeRemaining(InitialtimeToLogout)
    //             doLogout()
    //         }
    //     }, 1000);
    // }
    // return (
    //     <div>
    //         <IdleTimer
    //             ref={idleTimerRef}
    //             timeout={idleTime}
    //             onIdle={onIdle}
    //         ></IdleTimer>
    //         <DeleteDialog
    //             title={"You are about to be logged out"}
    //             open={popUpOpen}
    //             children={deactivateText}
    //             handleCancel={handleCancel}
    //             handleDelete={handleContinue}
    //             icon={TimeoutIcon}
    //             deleteText={`Continue (${timeRemaining})`}
    //             buttonClass={classes.continueButton}
    //             cancelButton={false}
    //             trashClass={classes.trash}
    //             trashContainerClass={classes.trashContainerClass}
    //             onBackdropClick={handleContinue}
    //         ></DeleteDialog>
    //     </div>
    // )
}

export default IdleTimerWrapper
