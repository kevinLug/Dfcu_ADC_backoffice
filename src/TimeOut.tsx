import React from 'react'
import Swal from "sweetalert2";
import {useEffect} from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

export interface ITimerDetails {
    timeElapsed: number;
    delayPeriod: number;
    remainingTime: number;
    isIdle: boolean;
}


export function countDownTimer(time: number) {
    console.log(time);

    let nextNumber = time - 1;

    if (nextNumber > 0) {

        countDownTimer(nextNumber);
        console.log('count-down:', nextNumber)

    }
}

const TimeOut = ({timeElapsed, delayPeriod, remainingTime, isIdle}: ITimerDetails) => {


    countDownTimer(3);

    function displayRemainingTime() {

        return <Grid>
            <Typography>Test the thing</Typography>
        </Grid>
    }

    return Swal.fire({
        title: 'Logging out in',
        icon: "warning",
        html: `${displayRemainingTime()}`,

    })

}

export default TimeOut