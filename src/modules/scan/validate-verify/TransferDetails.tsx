import React, {useEffect} from "react";
import {transferDetailsLabels} from "../../transfers/typeLabels";
import Grid from "@material-ui/core/Grid";
import DataLabel from "../../../components/DataLabel";
import DataValue from "../../../components/DataValue";
import {useSelector} from "react-redux";
import {ICaseState} from "../../../data/redux/transfers/reducer";
import {populateLabelAndValue} from "../populateLabelAndValue";
import {ConstantLabelsAndValues} from "../../../data/constants";
import {IForexValueState, reducer as forexDetails} from "../../../data/redux/forex/reducer";

const TransferDetails = () => {

    const {transferDetails}: ICaseState = useSelector((state: any) => state.transfers)
    const {aCase}: ICaseState = useSelector((state: any) => state.transfers)
    const {forexValue}: IForexValueState = useSelector((state: any) => state.forexDetails)
    useEffect(() => {

    }, [transferDetails, aCase, forexValue])

    return (

        <Grid container>

            {
                populateLabelAndValue(
                    [ConstantLabelsAndValues.COUNTRY_CODE],
                    transferDetailsLabels(transferDetails, aCase, forexValue), "-").map((kv, index) => {
                    // console.log("vincere:", kv)
                    return <Grid key={index} container item spacing={4} sm={12}>
                        <Grid item sm={5}>
                            <DataLabel noColon={true}>{kv.key}</DataLabel>
                        </Grid>
                        <Grid item sm={7}>
                            <DataValue>{kv.value}</DataValue>
                        </Grid>
                    </Grid>
                })

            }

        </Grid>
    )

}

export default TransferDetails