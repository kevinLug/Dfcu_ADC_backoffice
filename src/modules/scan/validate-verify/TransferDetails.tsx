import React, {useEffect} from "react";
import {transferDetailsLabels} from "../../transfers/typeLabels";
import Grid from "@material-ui/core/Grid";
import DataLabel from "../../../components/DataLabel";
import DataValue from "../../../components/DataValue";
import {useSelector} from "react-redux";
import {ICaseState} from "../../../data/redux/transfers/reducer";
import {populateLabelAndValue} from "../populateLabelAndValue";
import {ConstantLabelsAndValues} from "../../../data/constants";
import {IForexValueState} from "../../../data/redux/forex/reducer";

import {IForex, IForexDefault} from "../../transfers/types";
import {isNullOrUndefined} from "../../../utils/objectHelpers";


interface IProp {
    isForexRequired?: boolean
    forexDetailsReceived?: IForex
}

const TransferDetails = ({isForexRequired, forexDetailsReceived = IForexDefault}: IProp) => {

    const {transferDetails}: ICaseState = useSelector((state: any) => state.transfers)
    const {aCase}: ICaseState = useSelector((state: any) => state.transfers)
    const {forexValue}: IForexValueState = useSelector((state: any) => state.forexDetails)

    useEffect(() => {


    }, [transferDetails, aCase, forexValue])

    return (

        <Grid container>

            {
                isForexRequired && !isNullOrUndefined(forexDetailsReceived) ?

                    populateLabelAndValue(
                        [ConstantLabelsAndValues.COUNTRY_CODE],
                        transferDetailsLabels(transferDetails, aCase, forexDetailsReceived), "-").map((kv, index) => {
                        return <Grid key={index} container item spacing={4} sm={12}>
                            <Grid item sm={5}>
                                <DataLabel noColon={true}>{kv.key}</DataLabel>
                            </Grid>
                            <Grid item sm={7}>
                                <DataValue>{kv.value}</DataValue>
                            </Grid>
                        </Grid>
                    })

                    :

                    populateLabelAndValue(
                        [ConstantLabelsAndValues.COUNTRY_CODE],
                        transferDetailsLabels(transferDetails, aCase, forexValue), "-").map((kv, index) => {
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