
import {IPropsChecks} from "./Check";
import React, {useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import {ErrorIcon, SuccessIcon, WarningIcon} from "../../../components/xicons";

interface IProps {
    value: boolean;
    label: string;
    name: string;
    showSuperScript?: boolean;
    showWarning?:boolean
}

const SuccessFailureDisplay = ({value, label, name, showSuperScript, showWarning}: IProps) => {

    const [superScript, setSuperScript] = useState('')

    useEffect(() => {
        setSuperScriptValue()
    })

    function setSuperScriptValue() {
        const na = name.toLowerCase()

        if (!showSuperScript) {
            setSuperScript("")
        } else {

            // if (name.includes("confirmation")) {
            //     setSuperScript("BM")
            // } else {
            //     setSuperScript("CSO")
            // }
        }

    }


    return showWarning ?


        <Typography
            variant='subtitle1'
            style={{marginTop: 1}}>
            &nbsp;
            <WarningIcon
                fontSize='inherit'
            />
            {label}
            <sup><i><b>{superScript}</b></i></sup>
        </Typography>

        :

        value ?
        <Typography
            variant='subtitle1'
            style={{marginTop: 1}}>
            &nbsp;
            <SuccessIcon
                fontSize='inherit'
            />
            {label}
            <sup><i><b>{superScript}</b></i></sup>
        </Typography>

        :
        <Typography
            variant='subtitle1'
            style={{marginTop: 1}}>
            &nbsp;
            <ErrorIcon
                fontSize='inherit'
            />
            {label}
            <sup><i><b>{superScript}</b></i></sup>
        </Typography>
}

export default SuccessFailureDisplay