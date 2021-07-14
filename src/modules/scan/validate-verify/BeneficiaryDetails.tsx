import React, {useEffect} from "react";
import {
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
    const {aCase}: ICaseState = useSelector((state: any) => state.transfers)

    useEffect(() => {

        // console.log("logging: for recipient's bank name:",bankDetails.beneficiaryBank.bankName)

    }, [transferDetails, bankDetails, beneficiaryDetails, aCase])

    return (

        <Grid container>

            {/*{*/}
            {/*    populateLabelAndValue(["Branch", "Rate", "Currency", "Amount", "UGX Amount", 'Amount in words'],*/}
            {/*        transferDetailsLabels(transferDetails, aCase), "-").map((kv, index) => {*/}
            {/*        return <Grid key={index} container item spacing={4} sm={12}>*/}
            {/*            <Grid item sm={5}>*/}
            {/*                <DataLabel noColon={true}>{kv.key}</DataLabel>*/}
            {/*            </Grid>*/}
            {/*            <Grid item sm={7}>*/}
            {/*                <DataValue>{kv.value}</DataValue>*/}
            {/*            </Grid>*/}
            {/*        </Grid>*/}
            {/*    })*/}

            {/*}*/}

            {
                populateLabelAndValue(['Country','Plot','Building', 'Town', 'Country Code'], beneficiaryDetailsLabels(beneficiaryDetails, bankDetails), "-").map((kv, index) => {
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

export default BeneficiaryDetails