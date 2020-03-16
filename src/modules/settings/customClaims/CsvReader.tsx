import React, {useState} from 'react';
import Toast from "../../../utils/Toast";
import {Box, createStyles, Theme} from "@material-ui/core";
import UploadIcon from '@material-ui/icons/CloudUpload';
import {jsArray2CSV, parseCSV} from "../../../utils/stringHelpers";
import {XHeadCell} from "../../../components/table/XTableHead";
import {authEditableClaims} from "../users/details/ClaimsList";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import XTable from "../../../components/table/XTable";
import {createCsvColumns, createFakeClaims} from "../users/types";
import {DropzoneArea} from 'material-ui-dropzone'
import makeStyles from "@material-ui/core/styles/makeStyles";
import {hasNoValue, hasValue} from "../../../components/inputs/inputHelpers";
import {post} from "../../../utils/ajax";
import {remoteRoutes} from "../../../data/constants";
import {toAuthCustomClaimObject} from "./config";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        zoneHolder: {
            width: "100%"
        },
        zone: {
            width: "100%"
        },
    }),
);

interface IProps {
    done:()=>any
}

interface IFileState {
    isTrusted: boolean
    lengthComputable: boolean
    loaded: number
    total: number
    text: string | null
}

const readState = (evt: ProgressEvent<FileReader>): IFileState | undefined => {
    if (evt.target) {
        const {isTrusted, lengthComputable, loaded, total, target} = evt
        let text: string | null = null
        const result = target.result || null;
        if (typeof result === 'string') {
            text = result
        } else {
            Toast.error("Invalid File content")
        }
        return {
            isTrusted,
            lengthComputable,
            loaded,
            total,
            text: text
        }
    }
}

const columns: XHeadCell[] = [
    {name: "email", label: "Email"}
]
authEditableClaims.forEach(it => {
    columns.push({name: it, label: it})
})

const CsvReader = (props: IProps) => {
    const classes = useStyles()
    const [text, setText] = useState<string | null>(null)
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [total, setTotal] = useState<number>(0)
    const [progress, setProgress] = useState<number>(0)
    const normalise = (value: number) => (value) * 100 / (total);

    const [uploading, setUpLoading] = useState<boolean>(false)

    function handleFileChosen(files: any[]) {
        console.log("On files chose", files)
        if (hasNoValue(files)) {
            return;
        }
        const reader = new FileReader();
        reader.onloadstart = (evt) => {
            setLoading(true)
            const fileState = readState(evt)
            if (fileState) {
                setTotal(fileState.total)
                setProgress(fileState.loaded)
            }
        };

        reader.onloadend = (evt) => {
            setLoading(false)
            const fileState = readState(evt)
            if (fileState) {
                setTotal(fileState.total)
                setProgress(fileState.loaded)
            }
        };

        reader.onprogress = (evt) => {
            const fileState = readState(evt)
            if (fileState) {
                setTotal(fileState.total)
                setProgress(fileState.loaded)
            }
        };
        reader.onload = (evt) => {

            const fileState = readState(evt)
            if (fileState) {
                setTotal(fileState.total)
                setProgress(fileState.loaded)
                setText(fileState.text)
                if (fileState.text) {
                    setData(parseCSV(fileState.text))
                }

            } else {
                Toast.error("Invalid File content")
            }

        };
        setLoading(true)
        const file = files[0]
        reader.readAsText(file);
    }

    function handleDownLoad(e: any) {
        e.preventDefault();
        jsArray2CSV(createFakeClaims(), createCsvColumns())
    }

    function handleSubmit() {
        setUpLoading(true)
        const submitData = data.map(toAuthCustomClaimObject)
        post(remoteRoutes.userMultiClaims,submitData,resp=>{
            Toast.success("Claims successfully uploaded")
            props.done()
        },undefined,()=>{
            setUpLoading(false)
        })
    }

    return (
        <Grid container spacing={0}>

            <Grid item xs={12}>
                <Divider/>
                <Box display="flex" flexDirection='row' pt={2}>
                    <Box pr={2} pt={0.5}>
                        <Typography variant='body1'>Select a valid '.csv' file from your computer</Typography>
                    </Box>
                    <Box>
                        <Button onClick={handleDownLoad} variant='outlined' size='small' color='primary' disabled={uploading||loading}>Download sample
                            '.csv'</Button>
                    </Box>
                </Box>
                <Box display="flex" flexDirection='row' justifyContent='center' className={classes.zoneHolder}>
                    <Box className={classes.zoneHolder} p={2}>
                        <DropzoneArea
                            filesLimit={1}
                            showFileNames={true}
                            showFileNamesInPreview={true}
                            onChange={handleFileChosen}
                            acceptedFiles={['.csv']}
                            dropzoneClass={classes.zone}
                            dropzoneText='Drop csv here or click'
                        />
                    </Box>
                </Box>
                <Divider/>
            </Grid>
            {
                hasValue(data) &&
                <Grid item xs={12}>
                    <Box display="flex" flexDirection='row' py={1}>
                        <Box pr={2} pt={0.5}>
                            <Typography variant='h6'>Preview content</Typography>
                        </Box>
                        <Box>
                            <Button
                                variant='outlined'
                                size='small'
                                color='primary'
                                startIcon={<UploadIcon/>}
                                onClick={handleSubmit}
                                disabled={uploading}
                            >Save claims</Button>
                        </Box>
                    </Box>
                    <Divider/>
                    <Box display="flex" flexDirection='row'>
                        <XTable data={data} headCells={columns} primaryKey='email'/>
                    </Box>
                </Grid>
            }

        </Grid>
    );
}
export default CsvReader;
