import React, {useCallback, useEffect, useState} from 'react'
import Cropper from 'react-easy-crop'
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'
import {getOrientation} from 'get-orientation/browser'
import ImgDialog from './ImgDialog'
import {getCroppedImg, getRotatedImage} from './canvasUtils'

import {BrowserQRCodeReader} from "@zxing/library";
import {createStyles, makeStyles, Theme} from "@material-ui/core";
import {ScanResultRaw} from "./types";
import {ICase, ICaseDefault} from "../transfers/types";
import {formatRawTransferFormValuesToJson} from "./scanCropWorker";
import {login} from "../../api-stress/login";

import * as superagent from "superagent";
import {remoteRoutes} from "../../data/constants";
import validateData from "../validations/validations";
import Loading from "../../components/Loading";
import Toast from "../../utils/Toast";
import Grid from "@material-ui/core/Grid";
import ExpansionCard from "../../components/ExpansionCard";
import Dropzone from "react-dropzone";
import SenderDetails from "./validate-verify/SenderDetails";
import {Dispatch} from "redux";
import {useDispatch} from "react-redux";
import {actionICaseState} from "../../data/redux/transfers/reducer";
import BeneficiaryDetails from "./validate-verify/BeneficiaryDetails";
import TransferDetails from "./validate-verify/TransferDetails";
import ValidationCheckList, {checkListCSO} from "./validate-verify/ValidationCheckList";
import {isNullOrEmpty} from "../../utils/objectHelpers";

import ObjectHelpersFluent from "../../utils/objectHelpersFluent";
import {addCheck, IPropsChecks} from "./validate-verify/Check";
import {IList, List} from "../../utils/collections/list";
import {actionIWorkflowResponseMessage} from "../../data/redux/workflow-response/reducer";

const ORIENTATION_TO_ANGLE: any = {
    '3': 180,
    '6': 90,
    '8': -90,
}

const codeReader = new BrowserQRCodeReader()

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
    const [aCase] = useState<ICase>(ICaseDefault)
    const dispatch: Dispatch<any> = useDispatch();

    useEffect(() => {
    }, [aCase])

    const postData = (token: string, requestData: any, callBack: (data: any) => any) => {
        console.log({requestData})
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

        console.log({croppedArea, croppedAreaPixels}, {crop})

        try {

            const croppedImage: any = await getCroppedImg(imageSrc, croppedAreaPixels, 0)

            const decodedRawResult = await codeReader.decodeFromImage(undefined, croppedImage.toString())

            // check if decoding succeeded
            if (!new ObjectHelpersFluent().directValue(decodedRawResult.getText()).isAbsent().getFlag()) {
                Toast.warn("Auto scan failed. ")
                Toast.warn("Manually zoom the qr code image. ")
            } else {
                Toast.success("scan successful");
                setScanSuccessful(true)
            }

            const pairKeyValueFromDecodedRawResult = decodedRawResult.getText().split(",");

            // cleanup raw data
            pairKeyValueFromDecodedRawResult.forEach((pair) => {
                const valueTrimmed = pair.trim();
                const key = valueTrimmed.slice(0, 2)
                const value = valueTrimmed.slice(3, valueTrimmed.length)
                if (valueTrimmed !== "") {
                    rawTransferFormValues.set(key, value);
                }
            })

            const transferDetailsRaw = await getRawTransferFormValues(rawTransferFormValues);
            const aCase = await formatRawTransferFormValuesToJson(transferDetailsRaw, imageSrc);
            dispatch(actionICaseState(aCase));

            aCase.workflowType = "RTGS";
            const {access_token} = await login()

            if (aCase.workflowType !== "") {
                // console.log(aCase.workflowType)
                // console.log({access_token}, {aCase})

                validateData(aCase).then((validationResult) => {

                    if (validationResult) {
                        // console.log(`validated`)
                        postData(access_token, aCase, (resp: any) => {

                            dispatch(actionIWorkflowResponseMessage(resp))

                            console.log(`Submitted ${aCase.workflowType}`, resp)
                            setRequestSent(true)
                            Toast.success("scan complete")
                        })

                    }

                }).catch((err) => {
                    console.log('error: - ', err)
                    Toast.error("Processing failed");
                });
            }

            setResult(decodedRawResult.getText())
            // console.log("split: ",imageSrc.split(",")[1])
            // console.log('buffer', new Buffer(imageSrc.split(",")[1],"base64"));
            // console.log('buffer2', Uint8Array.from(atob(imageSrc.split(",")[1]), c => c.charCodeAt(0)));

            // const arrayBuffer = Uint8Array.from(atob(imageSrc.split(",")[1]), c => c.charCodeAt(0));
            // console.log(`array buffer: `,arrayBuffer)
            // const blob = new Blob([arrayBuffer])
            // const reader = new FileReader();
            // reader.readAsDataURL(blob);
            // reader.onload = (event: any) => {
            //     const base64 =   event.target.result
            //     // console.log(`unemployment:`,base64)
            //     setImageSrcFromBinary(base64)
            // };

        } catch (e) {
            console.log(e)
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
        console.log("dropped image:", imageDataUrl)
    }

    if (loading) {
        return <Loading message="processing...please wait"/>
    }

    const theCheckList = checkListCSO() as IList<IPropsChecks>

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
                    <ExpansionCard title="Validation Checklist"
                                   children={<ValidationCheckList theCheckList={theCheckList}/>}/>
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
                            <div className={classes.controls}>
                                <div className={classes.sliderContainer}>
                                    <Typography
                                        variant="overline"
                                        classes={{root: classes.sliderLabel}}
                                    >
                                        Zoom
                                    </Typography>
                                    <Slider
                                        value={zoom}
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        aria-labelledby="Zoom"

                                        onChange={(e, zoom) => setZoom(zoom)}
                                    />
                                </div>

                            </div>
                            <ImgDialog img={croppedImage} onClose={onClose}/>

                            upon scan successful, display image instead of scanning

                            */}


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

