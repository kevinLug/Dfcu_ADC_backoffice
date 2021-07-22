import React, {ChangeEvent, useEffect, useState} from 'react'

import Grid from "@material-ui/core/Grid";
import {Form, Formik} from "formik";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import {createStyles, makeStyles} from "@material-ui/core";

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
import Numbers from "../../../utils/numbers";

const useStyles = makeStyles(() =>
    createStyles({
        submissionGrid: {
            marginTop: 35
        },
        submissionBox: {
            display: 'flex',
            justifyContent: 'space-between',
            margin: 10
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
            // backgroundColor: 'teal'
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

interface IRateConfirmationFileUploadProps {
    classes: any;
    forexDetails: IForex;
}

const RateConfirmationFileUpload = ({classes, forexDetails}: IRateConfirmationFileUploadProps) => {
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
        const newForexDetails: IForex = {
            rate: forexDetails.rate,
            remittanceAmount: forexDetails.remittanceAmount,
            doc: imageDataUrl
        };
        Object.assign(forexDetails, newForexDetails)
        // console.log("dropped image:", imageDataUrl)
    }

    function determineFileUpload() {
        Toast.success("File upload successful")
        return ''
    }


    return <Grid>


        <Dropzone onDrop={handleDrop} accept="image/*">

            {({getRootProps, getInputProps}) => (
                <div {...getRootProps({className: "dropzone"})} className={classes.dropzoneClue}>
                    <input {...getInputProps()} />

                    <Card className={classes.browseFileStyle}>

                        <Typography className={classes.fontsUploadInstructions}>File upload</Typography>

                    </Card>

                </div>
            )}

        </Dropzone>

        {
            imageSrc ? determineFileUpload() : ""
        }

    </Grid>
}

/**
 * Internal constants to help avoid typos and uncalled-for errors
 * */
class InternalConstants {
    /**
     * FOREX RATE IS PRESENT
     * */
    public static TITLE_FOREX_RATE_EXISTS = 'FOREX RATE IS PRESENT'
    public static TITLE_REMITTANCE_AMOUNT_EXISTS = 'REMITTANCE AMOUNT IS PRESENT'
    /**
     * CONFIRM BOTH RATE & REMITTANCE AMOUNT EXIST
     * */
    public static TITLE_BOTH_REMITTANCE_AMOUNT_AND_EXIST = 'BOTH RATE AND REMITTANCE AMOUNT CAPTURED'

    public static BOTH_EXIST = 'REMITTANCE AMOUNT & FOREX RATE ARE PRESENT'
    /**
     * selector $.rate
     * */
    public static SELECT_RATE = "$.rate"
    /**
     * selector $.remittanceAmount
     * */
    public static SELECT_REMITTANCE_AMOUNT = "$.remittanceAmount"
}

const ForexForm = ({data, handleDialogCancel, handleSubmission, isSubmitBtnDisabled, isCancelBtnDisabled}: IProps) => {

    const classes = useStyles()

    const [rate] = useState('')
    const [remittanceAmount] = useState('')
    const [doc] = useState('')
    const initialData: IForex = {
        rate,
        remittanceAmount,
        doc
    }

    const [theData, setTheData] = useState(initialData)

    const dispatch: Dispatch<any> = useDispatch()

    useEffect(() => {

    }, [initialData])

    function handleRateChange(e: ChangeEvent<HTMLInputElement>) {
        // const unFormatted = Numbers.unFormat_En_UK_toNumber(e.target.value)
        // const toDisplay = Numbers.format_En_UK(unFormatted)
        // console.log("toDisplay:",toDisplay)
        initialData.rate = e.target.value
        // console.log("rate:",unFormatted)
        // console.log("rate:",Numbers.format_En_UK(Number(unFormatted)))
        // e.target.value = Numbers.format_En_UK(Number(unFormatted))

    }

    function handleRemittanceAmountChange(e: ChangeEvent<HTMLInputElement>) {
        // const unFormatted = Numbers.unFormat_En_UK_toNumber(e.target.value)
        // const toDisplay = Numbers.format_En_UK(unFormatted)
        initialData.remittanceAmount = e.target.value
        // e.target.value = toDisplay
    }

    function handleConfirmation() {

        const rateTest = new ObjectHelpersFluent();

        rateTest.testTitle(InternalConstants.TITLE_FOREX_RATE_EXISTS).selector(theData, InternalConstants.SELECT_RATE).isPresent()
            .failureCallBack(() => Toast.warn(`Please specify Rate`)).logDetailed().haltProcess(false, true);

        const remittanceAmountTest = new ObjectHelpersFluent();
        remittanceAmountTest.testTitle(InternalConstants.TITLE_REMITTANCE_AMOUNT_EXISTS).selector(theData, InternalConstants.SELECT_REMITTANCE_AMOUNT).isPresent()
            .failureCallBack(() => Toast.warn(`Please specify Remittance Amount`))
            .logDetailed().haltProcess(false, true);

        new ObjectHelpersFluent().testTitle(InternalConstants.TITLE_BOTH_REMITTANCE_AMOUNT_AND_EXIST).directValue(rateTest.getSummary().testResult === remittanceAmountTest.getSummary().testResult)
            .isEqualTo(true)
            .failureCallBack(() => Toast.warn(`Either the rate or remittance amount is missing`))
            .logDetailed().haltProcess(false, true)

        new ObjectHelpersFluent().testTitle("RATE CONFIRMATION FILE").selector(theData, '$.doc')
            .isPresent()
            .failureCallBack(() => Toast.warn(`Confirmation file is missing`))
            .successCallBack(() => {

                dispatch(actionIForexValue(initialData))
                Toast.success("Forex details capture")
                // close the dialog upon completion
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
                        <label>Rate</label>
                        <input type="text" onChange={handleRateChange}/>
                    </Box>

                    <Box className={classes.submissionBox}>

                        <label>Remittance amount</label>
                        <input type="text" onChange={handleRemittanceAmountChange}/>
                    </Box>

                </Grid>

                <Grid>

                    <Box className={classes.submissionBox}>
                        <RateConfirmationFileUpload classes={classes} forexDetails={theData}/>
                    </Box>


                </Grid>

                <Grid item sm={12} className={classes.submissionGrid}>

                    <Box className={classes.submissionBox}>

                        <Button type="submit" variant="contained" color="primary" disabled={isSubmitBtnDisabled} onSubmit={handleConfirmation}>OK</Button>
                        <Button variant="contained" className={classes.rejectButton} disabled={isCancelBtnDisabled} onClick={handleDialogCancel}>Cancel</Button>

                    </Box>
                </Grid>
            </Form>
        </Formik>

    </Grid>
}

export default ForexForm