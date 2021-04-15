import React, {useEffect} from "react";
import {beneficiaryAddressLabels, beneficiaryBankLabels, transferDetailsLabels} from "../../transfers/types";
import Grid from "@material-ui/core/Grid";
import DataLabel from "../../../components/DataLabel";
import DataValue from "../../../components/DataValue";
import {useSelector} from "react-redux";
import {ICaseState} from "../../../data/redux/transfers/reducer";
import {populateLabelAndValue} from "../populateLabelAndValue";

const BeneficiaryDetails = () => {

    const {transferDetails}: ICaseState = useSelector((state: any) => state.transfers)
    const {beneficiaryAddress}: ICaseState = useSelector((state: any) => state.transfers)
    const {beneficiaryBank}: ICaseState = useSelector((state: any) => state.transfers)

    useEffect(() => {

    }, [transferDetails, beneficiaryAddress])

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
                populateLabelAndValue(['Beneficiary Bank', 'Beneficiary Bank Swift Code', 'Beneficiary Bank Sort Code', 'Beneficiary Bank ABA',

                    'Beneficiary Fed wire', 'Beneficiary IFSC', 'Beneficiary Bank IBAN'

                ], beneficiaryBankLabels(beneficiaryBank), "-").map((kv, index) => {
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
                populateLabelAndValue(["Plot", "Building"], beneficiaryAddressLabels(beneficiaryAddress), "-").map((kv, index) => {
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

        </Grid>
    )

}

export default BeneficiaryDetails