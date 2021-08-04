import React, {useEffect, useState} from 'react'
import Workflows from "../workflows/Workflows";
import Grid from "@material-ui/core/Grid";

import {createStyles, makeStyles, Theme} from "@material-ui/core";
import ExpansionCard from "../../components/ExpansionCard";
import SenderDetails from "./validate-verify/SenderDetails";
import BeneficiaryDetails from "./validate-verify/BeneficiaryDetails";
import TransferDetails from "./validate-verify/TransferDetails";
import DescriptionAlerts from "./validate-verify/validation-check-list-place-holder";
import Typography from "@material-ui/core/Typography";
import CsoValidationChecklist from "./validate-verify/cso-validation-checklist";
import {ConstantLabelsAndValues} from "../../data/constants";
import ScanQrCode from "./ScanQrCode";
import {ICaseState} from "../../data/redux/transfers/reducer";
import {useSelector} from "react-redux";
import {fluentInstance} from "../../utils/objectHelpersFluent";
import PositionedSnackbar from "./PositionedSnackbar";

export const useStylesInitiateTransfer = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        expansion: {
            padding: 5
        },
        dragAndDropArea: {
            border: '3px dashed gray',
            borderRadius: 5,
            marginLeft: 25
        },
        dragAndDropAreaAfterScan: {
            border: '3px solid gray',
            borderRadius: 3,
            marginLeft: 25,
            width: '100%'
        },
        scannerAndDetailsDiver: {
            display: 'flex'
        },
        fontsUploadInstructions: {
            fontSize: 20,
            color: "grey"
        },

        browseButton: {
            textTransform: "lowercase"
        },
        dropzoneClue: {
            width: "100%",
            height: "100%",
            textAlign: "center",
            display: 'flex',
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            cursor: 'pointer'
        },
        imageAfterScan: {
            width: '100%',
            borderLeft: '35px solid #303f4f',
            borderRight: '35px solid #303f4f'
        },
        cropContainer: {
            position: 'relative',
            width: '100%',
            height: 200,
            background: '#333',
            [theme.breakpoints.up('sm')]: {
                height: 400,
            },
        },
        cropButton: {
            flexShrink: 0,
            marginLeft: 16,
        },
        controls: {
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            [theme.breakpoints.up('sm')]: {
                flexDirection: 'row',
                alignItems: 'center',
            },
        },
        sliderContainer: {
            display: 'flex',
            flex: '1',
            alignItems: 'center',
        },
        sliderLabel: {
            [theme.breakpoints.down('xs')]: {
                minWidth: 65,
            },
        },
        slider: {
            padding: '22px 0px',
            marginLeft: 16,
            [theme.breakpoints.up('sm')]: {
                flexDirection: 'row',
                alignItems: 'center',
                margin: '0 16px',
            },
        },

    })
);

const InitiateTransfer = () => {
    const classes = useStylesInitiateTransfer();

    const {aCase}: ICaseState = useSelector((state: any) => state.transfers)
    const [openSnackBar, setOpenSnackBar] = useState(false)
    const [snackBarMessage, setSnackBarMessage] = useState<any>()
    const [snackBarColor, setSnackBarColor] = useState<any>()

    useEffect(() => {

    }, [aCase, snackBarMessage, openSnackBar, snackBarColor])


    function showSnackBarMessage() {
        return openSnackBar ? <PositionedSnackbar message={snackBarMessage} shouldOpen={openSnackBar} severity={snackBarColor}/> : ""
    }

    return <Workflows>


        {
            showSnackBarMessage()
        }

        <Grid item sm={6}>
            <Typography variant='h4'>Validate money transfer request</Typography>
        </Grid>

        <Grid container item xs={12} className={classes.root}>


            <Grid item sm={4}>

                <Grid className={classes.expansion}>
                    <ExpansionCard title="Sender" children={<SenderDetails/>}/>
                </Grid>

                <Grid className={classes.expansion}>
                    <ExpansionCard title="Recipient" children={<BeneficiaryDetails/>}/>
                </Grid>

                <Grid className={classes.expansion}>
                    <ExpansionCard title="Transfer Request" children={<TransferDetails/>}/>
                </Grid>

                <Grid className={classes.expansion}>

                    <DescriptionAlerts/>

                </Grid>


            </Grid>

            <ScanQrCode/>

        </Grid>

    </Workflows>

}

export default InitiateTransfer