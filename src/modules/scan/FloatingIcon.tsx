import React, {useEffect, useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';

import {WifiOffRounded, WifiRounded} from "@material-ui/icons";
import {getPing} from "../../utils/ajax";
import {remoteRoutes} from "../../data/constants";
import {IServerPingValue} from "../transfers/types";
import {actionIServerPingValue, IServerPingValueState} from "../../data/redux/pings/reducer";
import {useDispatch, useSelector} from "react-redux";

import Tooltip from "@material-ui/core/Tooltip";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            margin: 0,
            top: "auto",
            right: 20,
            bottom: 20,
            left: 'auto',
            position: 'fixed',
        },
        extendedIcon: {
            marginRight: theme.spacing(1),
        },
        serverIsReachable: {
            color: "green"
        },
        serverIsNotReachable: {
            color: "red"
        }
    }),
);

const aMinute = 60000
export default function FloatingActionButtons() {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [isInitialServerAccess, setInitialServerAccess] = useState(true)

    const {serverPingValue}: IServerPingValueState = useSelector((state: any) => state.pings)
    useEffect(() => {

        tryReachingServer()

    }, [])

    function pingServer() {

        getPing(remoteRoutes.workflowsRoot, (resp: any) => {
                const serverPingValue: IServerPingValue = {
                    pingResponse: resp.statusCode,
                    isServerReachable: resp.statusCode !== null && resp.statusCode !== undefined
                }
                dispatch(actionIServerPingValue(serverPingValue))
                // workerPingServer.postMessage(resp.statusCode)
            },
            (resp: any) => {

                const message = resp["message"];
                if (message !== undefined && message !== null && message.includes("offline")) {
                    const serverPingValue: IServerPingValue = {
                        pingResponse: 503, // unavailable
                        isServerReachable: false
                    }
                    dispatch(actionIServerPingValue(serverPingValue))
                }
            },

            (resp: any) => {
                // console.log("end:-3", resp)
            }
        )

    }

    function tryReachingServer() {

        if (isInitialServerAccess) {

            pingServer()
        }

        setInterval(() => {
            setInitialServerAccess(false)

            pingServer()
            //check in every 2 minutes if server is reachable
        }, aMinute * 2)

    }

    return (
        <div className={classes.root}>

            {
                serverPingValue.isServerReachable ?
                    <Tooltip title="Server reachable">
                        <Fab className={classes.serverIsReachable} aria-label="add">
                            <WifiRounded/>
                        </Fab>
                    </Tooltip>
                    :
                    <Tooltip title="Server NOT reachable">
                        <Fab className={classes.serverIsNotReachable} aria-label="add">
                            <WifiOffRounded/>
                        </Fab>
                    </Tooltip>
            }

        </div>

    );
}
