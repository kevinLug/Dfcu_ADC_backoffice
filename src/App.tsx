import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {ToastContainer} from "react-toastify";
import ContentSwitch from "./modules/ContentSwitch";
import Login from "./modules/login/LoginSimple";
import Splash from "./modules/login/Splash";
import {useDispatch, useSelector} from 'react-redux'
import {ICoreState} from "./data/redux/coreReducer";
import {format} from "date-fns";
import {useIdleTimer} from 'react-idle-timer'
import {handleLogout} from "./data/redux/coreActions";
import authService from "./data/oidc/AuthService";
import worker_script, {ITimerDetails} from "./utils/activeTimeWorker";
import {ConstantLabelsAndValues} from "./data/constants";

let worker = new Worker(worker_script)

const App = () => {
    console.log("Starting App...")
    const {isLoading, user}: ICoreState = useSelector((state: any) => state.core)

    // periodic logout time dues to inactivity/idleness
    // 15 minutes
    const timeout = ConstantLabelsAndValues.A_MINUTE * 15;
    const [remaining, setRemaining] = useState(timeout)
    const [elapsed, setElapsed] = useState(0)
    const [lastActive, setLastActive] = useState(+new Date())
    const [lastEvent, setLastEvent] = useState('Events Emitted on Leader')
    const [leader, setLeader] = useState(true)
    const dispatch = useDispatch();

    const handleOnActive = () => setLastEvent('active')
    const handleOnIdle = () => setLastEvent('idle')

    const {
        reset,
        pause,
        resume,
        getRemainingTime,
        getLastActiveTime,
        getElapsedTime,
        isIdle,
        isLeader,
    } = useIdleTimer({
        timeout,
        onActive: handleOnActive,
        onIdle: handleOnIdle,
        crossTab: {
            emitOnAllTabs: true
        }
    })

    useEffect(() => {

        idleTimeSetup()

        // remaining, elapsed, lastActive
    }, [])




    function idleTimeSetup() {

        authService.userManager.getUser().then(e => {

            if (e !== null) {
                setInterval(() => {

                    setRemaining(getRemainingTime())
                    setLastActive(getLastActiveTime())
                    setElapsed(getElapsedTime())
                    setLeader(isLeader())

                    if (isIdle()) {
                        doLogout()
                            .then(e => {

                                // window.location.href = window.location.origin
                                pause()
                            }).then(e => pause())

                    } else {
                        const timerDetails: ITimerDetails = {
                            remainingTime: getRemainingTime(),
                            timeElapsed: getElapsedTime(),
                            delayPeriod: timeout,
                            isIdle: isIdle()
                        }
                        worker.postMessage(timerDetails)
                    }

                }, ConstantLabelsAndValues.A_MINUTE * 5)
            }
        })

    }

    async function doLogout() {
        dispatch(handleLogout())
        await authService.logout()
    }

    function millisToMinutesAndSeconds(millis: number) {
        let minutes = Math.floor(millis / 60000);
        let seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (Number(seconds) < 10 ? '0' : '') + seconds;
    }

    if (isLoading) {
        return <Splash/>
    } else {
        return <Router>
            <ToastContainer/>
            <>
                {user ?
                    <ContentSwitch/> :
                    <Switch>
                        <Route exact component={Login}/>
                    </Switch>
                }
            </>
        </Router>;
    }
}
export default App;
