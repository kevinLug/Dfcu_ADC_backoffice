// import Timeout = NodeJS.Timeout;
import {useIdleTimer} from 'react-idle-timer'

let interval: any

let timeElapsed = 0;
const timePeriod = 10000
let remainingTime = timePeriod
const aSecond = 1000
const aMinute = 60000
const anHour = 3600000


export interface ITimerDetails {
    timeElapsed: number;
    delayPeriod: number;
    remainingTime: number;
    isIdle: boolean;
}

export interface ITimerDetailsMessage {
    shouldLogout: boolean;
    shouldRaiseWarning: boolean;
    timeLeft: number
}

const idleTimeOutWorker = () => {

    // eslint-disable-next-line no-restricted-globals
    self.onmessage = function (e: MessageEvent) {

        const aMinute = 60000
        // console.log('Message received from main script:', e.data);
        // let workerResult = 'Received from main: ' + (e.data);
        // console.log('Posting message back to main script');

        let incomingData: ITimerDetails = <ITimerDetails>{}
        let outGoingData: ITimerDetailsMessage = <ITimerDetailsMessage>{}

        if (incomingData.isIdle){

        }else {}

        incomingData = e.data

        outGoingData.shouldRaiseWarning = incomingData.remainingTime <= aMinute;

        outGoingData.shouldLogout = incomingData.remainingTime <= 0;
        console.log(outGoingData)
        // @ts-ignore
        // eslint-disable-next-line no-restricted-globals
        self.postMessage(outGoingData);

        // setInterval(() => {
        //
        //     sum = sum + e.data
        //
        //     // @ts-ignore
        //     // eslint-disable-next-line no-restricted-globals
        //     self.postMessage(sum);
        //     observerUserActivity()
        // }, 1000)

    }
};

let code = idleTimeOutWorker.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));
const blob = new Blob([code], {type: "application/javascript"});
const worker_script = URL.createObjectURL(blob);

// module.exports = worker_script;

export default worker_script