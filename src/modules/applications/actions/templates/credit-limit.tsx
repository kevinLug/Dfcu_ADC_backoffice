import React from 'react';
import {Typography} from "@material-ui/core";
import RawData from "./RawData";
import {IAction} from "../../types";

interface IProps {
    action: IAction
}

const CreditLimit = ({action}: IProps) => {
    return (
        <div>
            <Typography>I am a credit limit</Typography>
            <RawData action={action}/>
        </div>
    );
}


export default CreditLimit;
