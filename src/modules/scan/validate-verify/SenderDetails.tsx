import React, {useEffect} from "react";
import {applicationDetailsLabels} from "../../transfers/typeLabels";
import Grid from "@material-ui/core/Grid";

import DataLabel from "../../../components/DataLabel";
import DataValue from "../../../components/DataValue";

import {useSelector} from "react-redux";
import {ICaseState} from "../../../data/redux/transfers/reducer";
import {populateLabelAndValue} from "../populateLabelAndValue";

const SenderDetails = () => {

    const {applicantDetails}: ICaseState = useSelector((state: any) => state.transfers)

    useEffect(() => {
        console.log(`applicantDetails:`, applicantDetails)
    }, [applicantDetails])

    return (

        <Grid container>

            {
                populateLabelAndValue([], applicationDetailsLabels(applicantDetails), "-").map((kv, index) => {
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

export default SenderDetails