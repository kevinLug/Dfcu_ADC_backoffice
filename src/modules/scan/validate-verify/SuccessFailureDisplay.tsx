
import {IPropsChecks} from "./Check";
import React, {useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import {ErrorIcon, SuccessIcon} from "../../../components/xicons";

const SuccessFailureDisplay = (v: IPropsChecks, showSuperScript = false) => {

    const [superScript, setSuperScript] = useState('')

    useEffect(() => {
        setSuperScriptValue()
    })

    function setSuperScriptValue() {
        const name = v.name.toLowerCase()

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


    return v.value ?
        <Typography
            variant='subtitle1'
            style={{marginTop: 1}}>
            &nbsp;
            <SuccessIcon
                fontSize='inherit'
            />
            {v.label}
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
            {v.label}
            <sup><i><b>{superScript}</b></i></sup>
        </Typography>
}

export default SuccessFailureDisplay