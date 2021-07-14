import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {useDispatch} from "react-redux";
import {IKeyValueMap, KeyValueMap} from "../../../utils/collections/map";
import {Dispatch} from "redux";
import {actionICheckKeyValue} from "../../../data/redux/checks/reducer";
import {ICheckKeyValue} from "../../transfers/types";
import Typography from "@material-ui/core/Typography";
import {ErrorIcon, SuccessIcon} from "../../../components/xicons";

export interface IPropsChecks {
    value: boolean;
    label: string;
    name: string;
    usePropValue?: boolean;
    handleCheckChange?: (event: React.ChangeEvent<HTMLInputElement>) => any;
    disable?: boolean;
}


export const addCheck = (label: string, name: string, value: boolean = false) => {

    const theCheckObject: IPropsChecks = {
        label,
        name,
        value,
    }
    return theCheckObject;
}

export class Checks {

    private static checksKeyValue: IKeyValueMap<string, boolean> = new KeyValueMap<string, boolean>()
    private static checksDisablingKeyValue: IKeyValueMap<string, boolean> = new KeyValueMap<string, boolean>()

    public static addChecksKeyValue(name: string, value: boolean): void {
        Checks.checksKeyValue.put(name, value);
    }

    public static getChecksKeyValue(): IKeyValueMap<string, boolean> {
        return Checks.checksKeyValue
    }

    public static getChecksDisablingKeyValue(): IKeyValueMap<string, boolean> {
        return Checks.checksDisablingKeyValue
    }

}

const CheckBoxTemplate = ({value, label, name, usePropValue = false, disable, handleCheckChange}: IPropsChecks) => {

    const [stateValue, setStateValue] = useState<boolean>(value)
    const [state, setState] = useState<boolean>(value)

    const [checks, setChecks] = useState<IKeyValueMap<string, boolean>>(new KeyValueMap<string, boolean>())
    const dispatch: Dispatch<any> = useDispatch()

    useEffect(() => {

        if (!usePropValue) {
            Checks.addChecksKeyValue(name, state)
            const checksState: ICheckKeyValue = {
                checks: Checks.getChecksKeyValue()
            }
            dispatch(actionICheckKeyValue(checksState))
        } else {
            Checks.addChecksKeyValue(name, stateValue)
            const checksState: ICheckKeyValue = {
                checks: Checks.getChecksKeyValue()
            }
            dispatch(actionICheckKeyValue(checksState))
        }

        // @ts-ignore

    }, [state, checks, Checks.getChecksKeyValue(), Checks.getChecksDisablingKeyValue()])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        if (usePropValue) {
            setStateValue(value);
            console.log(stateValue)
        } else {
            setState(event.target.checked);
            console.log(event.target.checked)
            console.log(state)
        }
        if (handleCheckChange) {
            handleCheckChange(event)
        }
    };

    return <Grid>
        <FormControlLabel
            control={<Checkbox checked={state} name={name} onChange={handleChange} disabled={disable}/>}
            label={label}/>
    </Grid>
}

export default CheckBoxTemplate