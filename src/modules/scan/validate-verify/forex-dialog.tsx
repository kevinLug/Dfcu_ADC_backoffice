import React, {ChangeEvent, useEffect, useState} from 'react'

import Grid from "@material-ui/core/Grid";
import {Form, Formik} from "formik";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import {createStyles, makeStyles} from "@material-ui/core";

import TextField from "@material-ui/core/TextField";
import {Dispatch} from "redux";
import {useDispatch} from "react-redux";
import {actionIForexValue} from "../../../data/redux/forex/reducer";
import {IForex} from "../../transfers/types";
import Dropzone from "react-dropzone";
import Typography from "@material-ui/core/Typography";
import {getOrientation} from "get-orientation/browser";
import {getRotatedImage} from "../canvasUtils";
import Card from "@material-ui/core/Card";
import ObjectHelpersFluent from "../../../utils/objectHelpersFluent";
import Toast from "../../../utils/Toast";

const useStyles = makeStyles(() =>
    createStyles({
        submissionGrid: {
            marginTop: 35
        },
        submissionBox: {
            display: 'flex',
            justifyContent: 'space-between'
        },
        rejectButton: {
            backgroundColor: '#b32121',
            color: 'white'
        }
        ,

        field: {
            padding: 10
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

        browseFileStyle: {
            backgroundColor: 'teal'
        }

    })
);

interface IProps {
    data?: any;
    handleDialogCancel?: () => any
    handleSubmission?: () => any
    isSubmitBtnDisabled?: boolean
    isCancelBtnDisabled?: boolean
    children?: any
}

function readFile(file: any) {
    return new Promise(resolve => {
        const reader = new FileReader()
        reader.addEventListener('load', () => resolve(reader.result), false)
        reader.readAsDataURL(file)
    })
}

const ORIENTATION_TO_ANGLE: any = {
    '3': 180,
    '6': 90,
    '8': -90,
}

const RateConfirmationFileUpload = ({classes}: any) => {
    const [imageSrc, setImageSrc] = useState<string>("")

    async function handleDrop(files: any) {

        const theFile = files[0]
        let imageDataUrl: any = await readFile(theFile)
        //todo apply rotation if needed...unnecessary for now
        const orientation = await getOrientation(theFile)
        const rotation = ORIENTATION_TO_ANGLE[orientation]
        if (rotation) {
            imageDataUrl = await getRotatedImage(imageDataUrl, rotation)
        }

        // console.log("rate file:", imageDataUrl)

        setImageSrc(imageDataUrl)
        // console.log("dropped image:", imageDataUrl)
    }

    return <Grid>
        <Dropzone onDrop={handleDrop} accept="image/*">

            {({getRootProps, getInputProps}) => (
                <div {...getRootProps({className: "dropzone"})} className={classes.dropzoneClue}>
                    <input {...getInputProps()} />

                    <Card className={classes.browseFileStyle}>
                        <Typography className={classes.fontsUploadInstructions}>Rate confirmation file</Typography>

                        <Typography>Drop your file here or click to browse</Typography>

                    </Card>

                </div>
            )}

        </Dropzone>

        <Grid container item xs={12}>
            {
                imageSrc ? <img src={imageSrc} className={classes.imageAfterScan} alt="scanned-result"/> : ""
            }
        </Grid>
    </Grid>
}

class InternalConstants {
    public static TITLE_FOREX_RATE_EXISTS = 'FOREX RATE IS PRESENT'
    public static TITLE_REMITTANCE_AMOUNT_EXISTS = 'REMITTANCE AMOUNT IS PRESENT'
    public static TITLE_BOTH_REMITTANCE_AMOUNT_AND_EXIST = 'CONFIRM BOTH RATE & REMITTANCE AMOUNT EXIST'
    public static BOTH_EXIST = 'REMITTANCE AMOUNT & FOREX RATE ARE PRESENT'
    public static SELECT_RATE = "$.rate"
    public static SELECT_REMITTANCE_AMOUNT = "$.remittanceAmount"
}

const ForexForm = ({data, handleDialogCancel, handleSubmission, isSubmitBtnDisabled, isCancelBtnDisabled}: IProps) => {

    const classes = useStyles()

    const [rate] = useState('')
    const [remittanceAmount] = useState('')
    const initialData: IForex = {
        rate,
        remittanceAmount
    }

    const [theData, setTheData] = useState(initialData)

    const dispatch: Dispatch<any> = useDispatch()

    useEffect(() => {

    }, [])

    function handleRateChange(e: ChangeEvent<HTMLInputElement>) {
        initialData.rate = e.target.value
    }

    function handleRemittanceAmountChange(e: ChangeEvent<HTMLInputElement>) {
        initialData.remittanceAmount = e.target.value
    }

    function handleConfirmation() {

        const rateTest = new ObjectHelpersFluent();

        rateTest.testTitle(InternalConstants.TITLE_FOREX_RATE_EXISTS).selector(theData, InternalConstants.SELECT_RATE).isPresent()
            .failureCallBack(() => Toast.warn(`Please specify Rate`)).logDetailed().haltProcess(false, true);

        const remittanceAmountTest = new ObjectHelpersFluent();
        remittanceAmountTest.testTitle(InternalConstants.TITLE_REMITTANCE_AMOUNT_EXISTS).selector(theData, InternalConstants.SELECT_REMITTANCE_AMOUNT).isPresent()
            .failureCallBack(() => Toast.warn(`Please specify Remittance Amount`))
            .logDetailed().haltProcess(false, true);

        new ObjectHelpersFluent().testTitle(InternalConstants.TITLE_BOTH_REMITTANCE_AMOUNT_AND_EXIST).directValue(rateTest.getSummary().testResult === remittanceAmountTest.getSummary().testResult).isEqualTo(true)
            .failureCallBack(() => Toast.warn(`Either the rate or remittance amount is missing`)).successCallBack(() => {

            dispatch(actionIForexValue(initialData))
            Toast.success("Forex details capture")
            if (handleDialogCancel) {
                handleDialogCancel()
            }

        }).logDetailed().haltProcess(false, true)

    }

    return <Grid item sm={12}>

        <Formik

            enableReinitialize

            initialValues={initialData}
            onSubmit={async (values) => {
                await new Promise(resolve => {
                    setTimeout(resolve, 500)
                    console.log("sub value: ", values)
                    setTheData(values)
                    handleConfirmation()
                    // alert(`ale-2${JSON.stringify(data, null, 2)}:`);
                });

            }}
        >
            <Form>

                <Grid>

                    <Box className={classes.submissionBox}>

                        <TextField onChange={handleRateChange} className={classes.field} label="Rate" variant="outlined"/>

                    </Box>

                    <Box className={classes.submissionBox}>

                        <TextField onChange={handleRemittanceAmountChange} className={classes.field} label="Remittance amount" variant="outlined"/>

                    </Box>

                </Grid>

                <Grid>
                    <RateConfirmationFileUpload classes={classes}/>
                </Grid>

                <Grid item sm={12} className={classes.submissionGrid}>

                    <Box className={classes.submissionBox}>

                        <Button variant="contained" className={classes.rejectButton} disabled={isCancelBtnDisabled} onClick={handleDialogCancel}>Cancel</Button>
                        <Button type="submit" variant="contained" color="primary" disabled={isSubmitBtnDisabled} onSubmit={handleConfirmation}>Confirm</Button>

                    </Box>
                </Grid>
            </Form>
        </Formik>

    </Grid>
}

export default ForexForm