import Grid from "@material-ui/core/Grid";
import {isNullOrEmpty} from "../../utils/objectHelpers";
import React, {useCallback, useEffect, useState} from "react";
import Cropper from "react-easy-crop";
import Button from "@material-ui/core/Button";
import {ZoomIn, ZoomOut} from "@material-ui/icons";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import RotateRightIcon from "@material-ui/icons/RotateRight";
import ImgDialog from "./ImgDialog";
import Dropzone from "react-dropzone";
import Typography from "@material-ui/core/Typography";
import {createStyles, makeStyles, Theme} from "@material-ui/core";
import {getCroppedImg, getRotatedImage} from "./canvasUtils";
import ObjectHelpersFluent from "../../utils/objectHelpersFluent";
import Toast from "../../utils/Toast";
import {login} from "../../api-stress/login";
import {randomInt} from "../../utils/numberHelpers";
import uuid from "uuid";
import {actionICaseState} from "../../data/redux/transfers/reducer";
import validateData from "../validations/validations";
import idbHandler from "../../data/indexed-db/indexedDbHandler";
import SuccessCriteria from "../../utils/successCriteria";
import {BrowserMultiFormatReader} from "@zxing/library";
import RunMappingRules from "./mappings/runMappingRules";
import {ICase, ICaseDefault, ITimestampRun} from "../transfers/types";
import {getOrientation} from "get-orientation/browser";
import {Dispatch} from "redux";
import {useDispatch, useSelector} from "react-redux";
import {ICoreState} from "../../data/redux/coreReducer";
import AlertDialogForMessages from "./AlertDialog";
import {post} from "../../utils/ajax";
import {localRoutes, remoteRoutes} from "../../data/constants";
import {actionIWorkflowResponseMessage} from "../../data/redux/workflow-response/reducer";
import {fetchWorkflowAsync, startWorkflowFetch} from "../../data/redux/workflows/reducer";


const useTyleScanQrCode = makeStyles((theme: Theme) =>
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

const codeReader = new BrowserMultiFormatReader()

const ORIENTATION_TO_ANGLE: any = {
    '3': 180,
    '6': 90,
    '8': -90,
}

const ScanQrCode = () => {

    const classes = useTyleScanQrCode();
    const runMappingRules = new RunMappingRules();

    const [imageSrc, setImageSrc] = useState<string>("")
    const [iScanSuccessful, setScanSuccessful] = useState(false)
    const [openSnackBar, setOpenSnackBar] = useState(false)

    const [snackBarMessage, setSnackBarMessage] = useState<any>()
    const [snackBarColor, setSnackBarColor] = useState<any>()

    const [infoMessages, setInfoMessages] = useState<string[]>([])


    const [crop, setCrop] = useState({x: -261, y: 454})
    const [rotation, setRotation] = useState(0)
    const [zoom, setZoom] = useState<any>(3)
    const [croppedImage, setCroppedImage] = useState<any>(null)
    const [result, setResult] = useState(``)
    const [rawTransferFormValues] = useState(new Map())
    const [aCase, setACase] = useState<ICase>(ICaseDefault)
    const dispatch: Dispatch<any> = useDispatch();
    const {user}: ICoreState = useSelector((state: any) => state.core)

    useEffect(() => {

    }, [aCase, snackBarMessage, openSnackBar, snackBarColor])

    let counter = 0

    async function onCropComplete(croppedArea: any, croppedAreaPixels: any) {

        try {

            const croppedImage: any = await getCroppedImg(imageSrc, croppedAreaPixels, 0)

            const decodedRawResult = await codeReader.decodeFromImage(undefined, croppedImage.toString())
            console.log(`decoded:`, decodedRawResult.getText())

            const resultOfScan = await runMappingRules.getScanResult(decodedRawResult.getText());
            console.log('result of scan: ', resultOfScan);

            // check if decoding succeeded
            if (!new ObjectHelpersFluent().directValue(decodedRawResult.getText()).isPresent().getFlag()) {
                Toast.warn("Auto scan failed. ")
                Toast.warn("Manually zoom the qr code image. ")
            } else {
                Toast.success("scan successful");
                setScanSuccessful(true)
                counter = counter + 1
            }

            const pairKeyValueFromDecodedRawResult = decodedRawResult.getText().split(",");

            // cleanup raw data
            pairKeyValueFromDecodedRawResult.map((pair) => {
                const valueTrimmed = pair.trim();
                const key = valueTrimmed.slice(0, 2)
                const value = valueTrimmed.slice(3, valueTrimmed.length)
                if (valueTrimmed !== "") {
                    rawTransferFormValues.set(key, value);
                }
            })

            Object.assign(aCase, runMappingRules.setCase(resultOfScan));
            // console.log('aCase:', aCase)
            // console.log(aCase.workflowType)

            const {access_token} = await login()


            // the counter is to allow sending the a Post request only once
            if (counter === 1 && aCase.workflowType !== "") {

                const userObj = {
                    "id": user.sub,
                    "name": user.name,
                    "phone": "",
                    "agentCode": "",
                    "branchName": "",
                    "region": ""
                }

                console.log(aCase.workflowType)
                console.log({aCase})

                aCase.applicationDate = new Date()
                aCase.referenceNumber = randomInt(100000, 500000) // todo...this will have to be picked from the PDF to avoid redundancy
                aCase.externalReference = uuid()
                aCase.caseData.user = userObj;
                aCase.caseData.doc = imageSrc


                const newDate = aCase.applicationDate
                aCase.caseData.timestampRun = {
                    csoInitiationDateTime: newDate,
                    csoSubmissionDateTime: newDate,
                    bmoApprovalDateTime: newDate,
                    cmoClearanceDateTime: newDate
                };

                // set csoInitiationDateTime
                console.log('timestamp:', aCase.caseData.timestampRun)
                console.log('timestamp:', aCase)

                // aCase.caseData.doc = ImageUtils.base64ToArrayBuffer(imageSrc)

                dispatch(actionICaseState(aCase));

                const validationResult = await validateData(aCase);

                // todo...try getting use from the one the logged in

                console.log('idb-support: ', idbHandler.isSupported())
                const ttt = await idbHandler.setUpDb("test_again")
                console.log('sss:', ttt)
                console.log('sss:', idbHandler.getDb())
                if (validationResult) {

                    console.log("the user: ", user)
                    console.log("the case: ", aCase)

                    post(remoteRoutes.workflows, aCase, (resp: any) => {
                            console.log('resp-initiation:', resp) // todo ... consider providing a message for both success and failure
                            dispatch(actionIWorkflowResponseMessage(resp))

                            const postResp = new ObjectHelpersFluent()
                            postResp.selector(resp, '$.caseId')
                                .isPresent()
                                .logDetailed()
                                .successCallBack(() => {
                                    Toast.success("Initiated successfully")
                                    dispatch(startWorkflowFetch())
                                    dispatch(fetchWorkflowAsync(postResp.getSummary().value))
                                    // refresh to show details of new case initiated
                                    window.location.href = `${localRoutes.applications}/${resp.caseId}`
                                })
                                .failureCallBack(() => {
                                    Toast.warn("Something is wrong")
                                })

                        }, undefined,
                        () => {

                            // pick caseId of initiated case

                            // refresh page based on the caseId

                            console.log("results-from-tests-failed: ", SuccessCriteria.getFailedTestResults(aCase.workflowType))
                            console.log("results-from-tests-passed: ", SuccessCriteria.getPassedTestResults(aCase.workflowType))
                            console.log("summary: ", SuccessCriteria.getSuccessCriteriaSummarySet())

                        }
                    )

                } else {
                    Toast.warn("Incomplete info in scan result")

                    Toast.error("Initiation failed")

                    console.log("results-from-tests-failed: ", SuccessCriteria.getFailedTestResults(aCase.workflowType))
                    console.log("results-from-tests-passed: ", SuccessCriteria.getPassedTestResults(aCase.workflowType))
                    console.log("summary: ", SuccessCriteria.getSuccessCriteriaSummarySet())

                    const messages = SuccessCriteria.getFailedTestResults(aCase.workflowType).toArray().map((msg) => {
                        return msg.userFailureMessage
                    })
                    // @ts-ignore
                    setInfoMessages(messages)

                    setOpenSnackBar(true)

                }
            }

            setResult(decodedRawResult.getText())

        } catch (e) {
            console.log(e)
            Toast.warn("Not scanned, zoom or rotate target area")
        }

    }

    const onClose = useCallback(() => {
        setCroppedImage(null)
    }, [])

    const handleDrop = async (files: any) => {

        const theFile = files[0]
        let imageDataUrl: any = await readFile(theFile)
        //todo apply rotation if needed...unnecessary for now
        const orientation = await getOrientation(theFile)
        const rotation = ORIENTATION_TO_ANGLE[orientation]
        if (rotation) {
            imageDataUrl = await getRotatedImage(imageDataUrl, rotation)
        }

        setImageSrc(imageDataUrl)
        // console.log("dropped image:", imageDataUrl)
    }

    function handleZoomIn() {
        const prevZoom = zoom + 0.1
        setZoom(prevZoom)
    }

    function handleZoomOut() {
        const prevZoom = zoom - 0.1
        setZoom(prevZoom)
    }

    function handleLeftRotation() {
        const prevRotation = rotation - 5
        setRotation(prevRotation)
    }

    function handleRightRotation() {
        const prevRotation = rotation + 5
        setRotation(prevRotation)
    }

    function showSnackBarMessage() {
        // return openSnackBar ? <PositionedSnackbar message={snackBarMessage} shouldOpen={openSnackBar} severity={snackBarColor}/> : ""
        return openSnackBar ? <AlertDialogForMessages messages={infoMessages} title="Missing requirements (Initiation failed)" shouldOpen={openSnackBar}/> : ""
    }

    //
    // function showStackedSnackBarMessage() {
    //     return openSnackBar ? <StackedSnackbars message={snackBarMessage} shouldOpen={openSnackBar} variant={snackBarColor}/> : ""
    // }


    return <Grid item sm={7} container alignContent={"center"} justify="center"
                 className={isNullOrEmpty(result) ? classes.dragAndDropArea : classes.dragAndDropAreaAfterScan}>
        {imageSrc ? (

            !iScanSuccessful ?

                // show cropper if not yet scanned
                <React.Fragment>
                    <div className={classes.cropContainer}>
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            rotation={rotation}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onRotationChange={setRotation}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}

                        />
                    </div>

                    <Button variant="contained" onClick={handleZoomOut}>
                        Zoom out<ZoomOut/>
                    </Button>

                    <Button variant="contained" onClick={handleZoomIn}>
                        Zoom in<ZoomIn/>
                    </Button>

                    <Button variant="outlined" onClick={handleLeftRotation}>
                        Rotate Left<RotateLeftIcon/>
                    </Button>

                    <Button variant="outlined" onClick={handleRightRotation}>
                        Rotate Right<RotateRightIcon/>
                    </Button>

                    <ImgDialog img={croppedImage} onClose={onClose}/>


                </React.Fragment>

                :

                // show image upon scanning

                <Grid container item xs={12}>
                    <img src={imageSrc} className={classes.imageAfterScan} alt="scanned-result"/>
                </Grid>

        ) : (

            <Dropzone onDrop={handleDrop} accept="image/*">

                {({getRootProps, getInputProps}) => (
                    <div {...getRootProps({className: "dropzone"})} className={classes.dropzoneClue}>
                        <input {...getInputProps()} />

                        <Grid>
                            <Typography className={classes.fontsUploadInstructions}>Upload transfer request
                                form</Typography>

                            <Typography>Drop your file here or click to browse</Typography>

                        </Grid>

                    </div>
                )}

            </Dropzone>

        )}

        {
            showSnackBarMessage()
        }


    </Grid>
}

function readFile(file: any) {
    return new Promise(resolve => {
        const reader = new FileReader()
        reader.addEventListener('load', () => resolve(reader.result), false)
        reader.readAsDataURL(file)
    })
}

export default ScanQrCode