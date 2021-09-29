import {ITimerDetails, ITimerDetailsMessage} from "../activeTimeWorker";
import {setInterval} from "timers";
import store from "../../data/redux/store";

export interface IWorkerServiceUtil {

}

class WorkerServiceUtil {
    receive(e: MessageEvent): any {
        // eslint-disable-next-line no-restricted-globals
        self.onmessage = () => {

        }
    }
}

const pingServer = () => {

    // eslint-disable-next-line no-restricted-globals
    self.onmessage = function (e: MessageEvent) {

        // const user = store.getState().core.user
        // console.log("from store:", user);
        console.log("ping came in:", e)
        // perform any action to be sent tot the UI

        setInterval(() => {
            console.log("yes...")
        }, 2000)

        // send the result to the UI
        // @ts-ignore
        // eslint-disable-next-line no-restricted-globals
        self.postMessage("nothing...");

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

let code = pingServer.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));
const blob = new Blob([code], {type: "application/javascript"});
const worker_script_ping_server = URL.createObjectURL(blob);

// module.exports = worker_script;

export default worker_script_ping_server

