import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {useDispatch} from "react-redux";
import {IKeyValueMap, KeyValueMap} from "../../../utils/collections/map";
import {Dispatch} from "redux";
import {actionICheckKeyValue} from "../../../data/redux/checks/reducer";
import {ICheckKeyValue} from "../../transfers/types";
import {IList} from "../../../utils/collections/list";

export interface IPropsChecks {
    value: boolean;
    label: string;
    name: string;
    usePropValue?: boolean;
    handleCheckChange?: () => boolean
}

export class Checks {

    private static checksKeyValue: IKeyValueMap<string, boolean> = new KeyValueMap<string, boolean>()

    public static setChecksKeyValueWithInitialCollection(checksKeyValue: IKeyValueMap<string, boolean>): void {
        let newChecks = new KeyValueMap<string, boolean>()
        newChecks.putAll(checksKeyValue);
        Checks.checksKeyValue = newChecks;
    }

    public static setChecksKeyValue(name: string, value: boolean): void {
        let newChecks = new KeyValueMap<string, boolean>()
        newChecks.put(name, value)
        Checks.checksKeyValue = newChecks;
    }

    public static addChecksKeyValue(name: string, value: boolean): void {
        Checks.checksKeyValue.put(name, value);
    }

    public static getChecksKeyValue(): IKeyValueMap<string, boolean> {
        return Checks.checksKeyValue
    }

}

export const initialChecks = (theCheckList: IList<IPropsChecks>, dispatch: Dispatch<any>) => {

    const kv = new KeyValueMap<string, boolean>()

    for (const iPropsCheck of theCheckList) {
        kv.put(iPropsCheck.name, iPropsCheck.value)
    }

    const checksState: ICheckKeyValue = {
        checks: kv
    }

    dispatch(actionICheckKeyValue(checksState))

}

const CheckBoxTemplate = ({value, label, name, usePropValue = false, handleCheckChange}: IPropsChecks) => {

    // const [stateValue, setStateValue] = useState<boolean>(value)
    const [stateValue, setStateValue] = useState<boolean>(value)
    const [state, setState] = useState<boolean>(value)
    // const [state, setState] = useState<boolean>(false)

    const [checks, setChecks] = useState<IKeyValueMap<string, boolean>>(new KeyValueMap<string, boolean>())
    const dispatch: Dispatch<any> = useDispatch()

    useEffect(() => {

        if (!usePropValue){
            Checks.addChecksKeyValue(name, state)
            const checksState: ICheckKeyValue = {
                checks: Checks.getChecksKeyValue()
            }
            dispatch(actionICheckKeyValue(checksState))
        }else {
            Checks.addChecksKeyValue(name, stateValue)
            const checksState: ICheckKeyValue = {
                checks: Checks.getChecksKeyValue()
            }
            dispatch(actionICheckKeyValue(checksState))
        }

        // console.log(checksState)
        // console.log(checks)
        // // for (const check of checks) {
        // console.log(Checks.getChecksKeyValue())
        // // }

    }, [state, checks, Checks.getChecksKeyValue()])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        if (usePropValue) {
            setStateValue(value);
            console.log(stateValue)
        } else {
            setState(event.target.checked);
            console.log(event.target.checked)
            console.log(state)
        }

        // Checks.addChecksKeyValue(name, state)
    };

    return <Grid>
        <FormControlLabel control={<Checkbox checked={state} name={name} onChange={handleChange}/>} label={label}/>
    </Grid>
}

export default CheckBoxTemplate