import React, {useState} from 'react'
import Grid from "@material-ui/core/Grid";
import PSelectInput from "../../../components/plain-inputs/PSelectInput";
import {toOptions} from "../../../components/inputs/inputHelpers";
import {IRemarks} from "./rejection-remarks-values";

import {Dispatch} from "redux";
import {useDispatch} from "react-redux";
import {ISelectKeyValue} from "../../transfers/types";
import {KeyValueMap} from "../../../utils/collections/map";
import {actionISelectKeyValue} from "../../../data/redux/selects/reducer";


// export class Selects {
//
//     private static selectsKeyValue: IKeyValueMap<string, any> = new KeyValueMap<string, any>()
//     private static selectsDisablingKeyValue: IKeyValueMap<string, any> = new KeyValueMap<string, any>()
//
//     public static addSelectsKeyValue(name: string, value: any): void {
//         Selects.selectsKeyValue.put(name, value);
//     }
//
//     public static getSelectsKeyValue(): IKeyValueMap<string, any> {
//         return Selects.selectsKeyValue
//     }
//
//     public static getSelectsDisablingKeyValue(): IKeyValueMap<string, any> {
//         return Selects.selectsDisablingKeyValue
//     }
//
// }

interface IRemark {
    aRemark: string;
}

const RejectionRemarks = ({remarks, role}: IRemarks) => {

    const [data, setData] = useState<IRemark>({aRemark: ''})
    const dispatch: Dispatch<any> = useDispatch()

    function handleChange(event: React.ChangeEvent<any>) {
        const name = event.target.name
        const value = event.target.value

        console.log('just:', name, value)
        const newData = {data, aRemark: value}
        setData(newData)

        const keyMap = new KeyValueMap<string, any>();
        keyMap.put(name, value)
        const aSelect: ISelectKeyValue = {
            selects: keyMap
        }

        console.log("selected value:", aSelect);
        dispatch(actionISelectKeyValue(aSelect))

    }

    return <Grid>
        <PSelectInput
            name={role}
            value={data['aRemark']}
            onChange={handleChange}

            label="Rejection reason"
            variant="outlined"
            size='small'
            options={toOptions(remarks.toArray())}
        />
    </Grid>
}

export default RejectionRemarks