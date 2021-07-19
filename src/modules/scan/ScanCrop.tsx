import React, {useCallback, useEffect, useRef, useState} from 'react'
import Cropper from 'react-easy-crop'

import Typography from '@material-ui/core/Typography'
import {getOrientation} from 'get-orientation/browser'
import ImgDialog from './ImgDialog'
import {getCroppedImg, getRotatedImage} from './canvasUtils'
import RotateRightIcon from '@material-ui/icons/RotateRight';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import {
    BrowserMultiFormatReader
} from "@zxing/library";

import {createStyles, makeStyles, Theme} from "@material-ui/core";
import {ScanResultRaw} from "./types";
import {ICase, ICaseDefault} from "../transfers/types";
import {formatRawTransferFormValuesToJson} from "./scanCropWorker";
import {login} from "../../api-stress/login";

import * as superagent from "superagent";
import {ConstantLabelsAndValues, remoteRoutes} from "../../data/constants";
import validateData from "../validations/validations";
import Loading from "../../components/Loading";
import Toast from "../../utils/Toast";
import Grid from "@material-ui/core/Grid";
import ExpansionCard from "../../components/ExpansionCard";
import Dropzone from "react-dropzone";
import SenderDetails from "./validate-verify/SenderDetails";
import {Dispatch} from "redux";
import {useDispatch, useSelector} from "react-redux";
import {actionICaseState} from "../../data/redux/transfers/reducer";
import BeneficiaryDetails from "./validate-verify/BeneficiaryDetails";
import TransferDetails from "./validate-verify/TransferDetails";

import {isNullOrEmpty, printValueObjectPrettified} from "../../utils/objectHelpers";

import ObjectHelpersFluent from "../../utils/objectHelpersFluent";
import {addCheck, IPropsChecks} from "./validate-verify/Check";
import {IList, List} from "../../utils/collections/list";
import {actionIWorkflowResponseMessage} from "../../data/redux/workflow-response/reducer";
import Button from "@material-ui/core/Button";
import {ZoomIn, ZoomOut, ZoomOutOutlined} from "@material-ui/icons";
import RunMappingRules from "./mappings/runMappingRules";

import worker_script_mappings from "./mappings/mappingsWorker";
import worker_script_rgtsValidationsWorker from "../transfers/rtgsValidationsWorker";
import {useWorker} from "@koale/useworker";
import validateRTGS from "../transfers/rtgsValidations";
import idbHandler from "../../data/indexed-db/indexedDbHandler";
import {randomInt} from "../../utils/numberHelpers";
import uuid from "uuid";
import {ICoreState} from "../../data/redux/coreReducer";
import ImageUtils from "../../utils/imageUtils";
import ValidationCheckList from "./validate-verify/ValidationCheckList";


let worker = new Worker(worker_script_mappings);
let workerRtgsValidation = new Worker(worker_script_rgtsValidationsWorker);

const ORIENTATION_TO_ANGLE: any = {
    '3': 180,
    '6': 90,
    '8': -90,
}

const codeReader = new BrowserMultiFormatReader()


export const useStyles = makeStyles((theme: Theme) =>
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

const ScanCrop = () => {

    const classes = useStyles();

    const runMappingRules = new RunMappingRules();

    const [resultObjectKeys, setResultObjectKeys] = useState<IList<string>>(new List());
    const [imageSrc, setImageSrc] = useState<string>("")
    const [iScanSuccessful, setScanSuccessful] = useState(false)

    const [crop, setCrop] = useState({x: -261, y: 454})
    const [rotation, setRotation] = useState(0)
    const [zoom, setZoom] = useState<any>(3)
    const [croppedImage, setCroppedImage] = useState<any>(null)
    const [result, setResult] = useState(``)
    const [rawTransferFormValues] = useState(new Map())
    const [loading] = useState<boolean>(false)
    const [requestSent, setRequestSent] = useState<boolean>(false)
    const [aCase, setACase] = useState<ICase>(ICaseDefault)
    const dispatch: Dispatch<any> = useDispatch();
    const [validationWorker, {status: workerStatus, kill: killWorker}] = useWorker(validateRTGS)
    const PDF417ReadOff = useRef(null);

    const {user}: ICoreState = useSelector((state: any) => state.core)

    useEffect(() => {
    }, [aCase])

    const postData = (token: string, requestData: any, callBack: (data: any) => any) => {
        console.log({requestData})
        console.log('port:', remoteRoutes.workflows)

        superagent.post(remoteRoutes.workflows)
            .set('Authorization', `Bearer ${token}`)
            .send(requestData)
            .end(((err: any, res: any) => {
                if (err) {
                    Toast.error("failed...")
                    console.error("Error...", err)
                } else {
                    callBack(res.body)
                }
            }))
    }

    const getRawTransferFormValues = async (transferValues: Map<any, any>): Promise<ScanResultRaw> => {
        let scanResultRaw = new ScanResultRaw();

        return new Promise<ScanResultRaw>(((resolve) => {
            const iterator = transferValues.entries()

            for (let i = 0; i < transferValues.size; i++) {
                const v = iterator.next().value
                const key: string = v[0].toString().trim();
                // @ts-ignore
                scanResultRaw[`${key}`] = v[1].toString().trim()
            }

            resolve(scanResultRaw);

        }))
    }

    const onCropComplete = async (croppedArea: any, croppedAreaPixels: any) => {

        console.log('cropping results:', {croppedArea, croppedAreaPixels}, {crop}, {zoom})

        try {

            // console.log(`with some-imageSrc:`, imageSrc)
            const croppedImage: any = await getCroppedImg(imageSrc, croppedAreaPixels, 0)
            // console.log(`with some-croppedImage:`, croppedImage)

            // const decodedRawResult = await codeReader.decodeFromImageUrl(croppedImage)

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

            if (aCase.workflowType !== "") {

                const userObj = {
                    "id": user.sub,
                    // "id": "1f824a84-46b6-4e7f-b601-5d041118439d",
                    "name": user.name,
                    "phone": "256781750721",
                    "agentCode": "2345566",
                    "branchName": "02",
                    "region": ""
                }

                console.log(aCase.workflowType)
                console.log({aCase})

                aCase.applicationDate = new Date()
                aCase.referenceNumber = randomInt(100000, 500000)
                aCase.externalReference = uuid()
                aCase.caseData.user = userObj;
                aCase.caseData.doc = imageSrc
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

                    postData(access_token, aCase, (resp: any) => {
                        dispatch(actionIWorkflowResponseMessage(resp))
                        Toast.success("scan complete")
                    })
                } else {
                    Toast.warn("Incomplete info in scan result")
                }
            }


            setResult(decodedRawResult.getText())

        } catch (e) {
            console.log(e)

            // to pinpoint PDF417
            // if (zoom === 3) {
            //     setZoom(1)
            //     setCrop({x: 0, y: -58.5})
            //
            //     autoClickToReadPDF417()
            // }


        }

    }

    function autoClickToReadPDF417() {
        // @ts-ignore
        PDF417ReadOff.current.click()
        console.log("auto clicking...")
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

    if (loading) {
        return <Loading message="processing...please wait"/>
    }

    // const theCheckList = checkListCSO() as IList<IPropsChecks>

    return (

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
                    <ExpansionCard title="Verification Checklist"
                                   children={<ValidationCheckList theCheckList={ConstantLabelsAndValues.csoValidationCheckList()}/>}/>
                </Grid>

            </Grid>

            <Grid item sm={7} container alignContent={"center"} justify="center"
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

                            <Button variant="contained" onClick={handleZoomIn} ref={PDF417ReadOff}>
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
            </Grid>

        </Grid>

    )
}

function readFile(file: any) {
    return new Promise(resolve => {
        const reader = new FileReader()
        reader.addEventListener('load', () => resolve(reader.result), false)
        reader.readAsDataURL(file)
    })
}


// @ts-ignore
export default ScanCrop

