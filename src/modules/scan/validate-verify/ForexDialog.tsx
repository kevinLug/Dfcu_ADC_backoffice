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
import {getOrientation} from "get-orientation/browser";
import {getRotatedImage} from "../canvasUtils";
import Card from "@material-ui/core/Card";
import ObjectHelpersFluent from "../../../utils/objectHelpersFluent";
import Toast from "../../../utils/Toast";
import Numbers from "../../../utils/numbers";


import NumberFormat from 'react-number-format';
import  {DialogTitleProps} from "./ForexDetailsFilePreview";
import Dialog from "@material-ui/core/Dialog";

import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import {Theme, withStyles} from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";


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
        label: {
            paddingRight: 30,
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
    docUpdating: (doc:string) => string
}

const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    });

const DialogTitlePreview = withStyles(styles)((props: DialogTitleProps) => {
    const {children, classes, onClose, ...other} = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon/>
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});


const RateConfirmationFileUpload = ({classes, forexDetails, docUpdating}: IRateConfirmationFileUploadProps) => {
    const [imageSrc, setImageSrc] = useState<string>("")
    const [theForexDetails] = useState(forexDetails)
    const [showPreview, setShowPreview] = useState(false)

    useEffect(() => {

    }, [imageSrc, theForexDetails, showPreview])

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
        setShowPreview(true)
    }



    function previewFile() {


        if (showPreview) {
            theForexDetails.doc = imageSrc
            docUpdating(imageSrc)
        }

        return imageSrc ? <Dialog onClose={() => setShowPreview(false)} aria-labelledby="customized-dialog-title" open={showPreview} disableBackdropClick={true}>
            <DialogTitlePreview id="customized-dialog-title" onClose={() => setShowPreview(false)}>
                Forex details file preview
            </DialogTitlePreview>
            <DialogContent dividers>

                {
                    <img src={imageSrc} alt="scanned-result"/>
                }

            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={() => setShowPreview(false)} color="primary">
                    OK
                </Button>
            </DialogActions>
        </Dialog> : ""
    }


    return <Grid>

        <Dropzone onDrop={handleDrop} accept="image/*">

            {({getRootProps, getInputProps}) => (
                <div {...getRootProps({className: "dropzone"})} className={classes.dropzoneClue}>
                    <input {...getInputProps()} />


                    <Card className={classes.browseFileStyle}>
                        <Button variant="contained" color="primary">File upload</Button>

                        {/*<Typography className={classes.fontsUploadInstructions}>File upload</Typography>*/}

                    </Card>

                </div>
            )}

        </Dropzone>

        {
            previewFile()
        }
        {
            // determineFileUpload()
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
    const [showPreview, setShowPreview] = useState(false)

    const [theData, setTheData] = useState(initialData)
    const [docUpdate, setDocUpdate] = useState('')

    const dispatch: Dispatch<any> = useDispatch()


    useEffect(() => {

    }, [initialData, showPreview])

    function handleRateChange(e: ChangeEvent<HTMLInputElement>) {

        // set rate
        initialData.rate = Numbers.unFormat_En_UK_toNumber(e.target.value)

    }

    function handleRemittanceAmountChange(e: ChangeEvent<HTMLInputElement>) {

        // set remittance amount
        initialData.remittanceAmount = Numbers.unFormat_En_UK_toNumber(e.target.value)

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

    function updatingDoc(doc:string){
        theData.doc = doc
        return doc
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

                });

            }}
        >
            <Form>

                <Grid>

                    <Box className={classes.submissionBox}>
                        <label>Rate</label>
                        <NumberFormat onChange={handleRateChange} thousandSeparator={true} inputMode="numeric"/>
                    </Box>

                    <Box className={classes.submissionBox}>

                        <label className={classes.label}>Remittance amount</label>
                        <NumberFormat onChange={handleRemittanceAmountChange} thousandSeparator={true} inputMode='numeric'/>

                    </Box>

                </Grid>

                <Grid>

                    <Box className={classes.submissionBox}>
                        <RateConfirmationFileUpload classes={classes} forexDetails={theData} docUpdating={updatingDoc} />
                        {/*<Button color="primary" variant='contained' type='button' onClick={viewFileOnDemand}>View file</Button>*/}
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