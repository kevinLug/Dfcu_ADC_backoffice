import React, {useEffect} from "react";
import {
    beneficiaryAddressLabels,
    beneficiaryBankLabels,
    beneficiaryDetailsLabels,
    transferDetailsLabels
} from "../../transfers/typeLabels";
import Grid from "@material-ui/core/Grid";
import DataLabel from "../../../components/DataLabel";
import DataValue from "../../../components/DataValue";
import {useSelector} from "react-redux";
import {ICaseState} from "../../../data/redux/transfers/reducer";
import {populateLabelAndValue} from "../populateLabelAndValue";

const BeneficiaryDetails = () => {

    const {transferDetails}: ICaseState = useSelector((state: any) => state.transfers)
    const {beneficiaryDetails}: ICaseState = useSelector((state: any) => state.transfers)
    const {bankDetails}: ICaseState = useSelector((state: any) => state.transfers)

    useEffect(() => {

    }, [transferDetails, bankDetails, beneficiaryDetails])

    return (

        <Grid container>

            {
                populateLabelAndValue(["Branch", "Rate", "Currency", "Amount", "UGX Amount", 'Amount in words'],
                    transferDetailsLabels(transferDetails), "-").map((kv, index) => {
                    return <Grid key={index} container item spacing={4} sm={12}>
                        <Grid item sm={5}>
                            <DataLabel noColon={false}>{kv.key}</DataLabel>
                        </Grid>
                        <Grid item sm={7}>
                            <DataValue>{kv.value}</DataValue>
                        </Grid>
                    </Grid>
                })

            }

            {
                populateLabelAndValue([], beneficiaryDetailsLabels(beneficiaryDetails), "-").map((kv, index) => {
                    return <Grid key={index} container item spacing={4} sm={12}>
                        <Grid item sm={5}>
                            <DataLabel noColon={false}>{kv.key}</DataLabel>
                        </Grid>
                        <Grid item sm={7}>
                            <DataValue>{kv.value}</DataValue>
                        </Grid>
                    </Grid>
                })
            }

            {/*{*/}
            {/*    populateLabelAndValue(["Plot", "Building"], beneficiaryAddressLabels(beneficiaryAddress), "-").map((kv, index) => {*/}
            {/*        return <Grid key={index} container item spacing={4} sm={12}>*/}
            {/*            <Grid item sm={5}>*/}
            {/*                <DataLabel noColon={false}>{kv.key}</DataLabel>*/}
            {/*            </Grid>*/}
            {/*            <Grid item sm={7}>*/}
            {/*                <DataValue>{kv.value}</DataValue>*/}
            {/*            </Grid>*/}
            {/*        </Grid>*/}
            {/*    })*/}
            {/*}*/}

        </Grid>
    )

}

export default BeneficiaryDetails