import React, {useEffect} from "react";
import { transferDetailsLabels} from "../../transfers/typeLabels";
import Grid from "@material-ui/core/Grid";
import DataLabel from "../../../components/DataLabel";
import DataValue from "../../../components/DataValue";
import {useSelector} from "react-redux";
import {ICaseState} from "../../../data/redux/transfers/reducer";
import {populateLabelAndValue} from "../populateLabelAndValue";

const TransferDetails = () => {

    const {transferDetails}: ICaseState = useSelector((state: any) => state.transfers)
    const {aCase}: ICaseState = useSelector((state: any) => state.transfers)
    useEffect(() => {

    }, [transferDetails,aCase])

    return (

        <Grid container>

            {
                populateLabelAndValue(["Beneficiary Name"],
                    transferDetailsLabels(transferDetails,aCase),"-").map((kv, index) => {
                        console.log("vincere:",kv)
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