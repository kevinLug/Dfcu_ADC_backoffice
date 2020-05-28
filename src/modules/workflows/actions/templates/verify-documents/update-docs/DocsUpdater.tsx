import React, {useState} from 'react';
import {IDocument, IWorkflow} from "../../../../types";
import CodeView from "../../../../../../components/CodeView";
import {GatewayDocument} from "../../../../../../data/types";
import {Box} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import PSelectInput from "../../../../../../components/plain-inputs/PSelectInput";
import TextField from "@material-ui/core/TextField";
import EditDialog from "../../../../../../components/EditDialog";
import Button from "@material-ui/core/Button";
import Toast from "../../../../../../utils/Toast";
import {remoteRoutes} from "../../../../../../data/constants";
import {downLoad, postFile} from "../../../../../../utils/ajax";
import {saveDocument} from "../../../../../../data/redux/coreActions";
import {useDispatch} from "react-redux";
import {updateWorkflowDocs} from "../../../../../../data/redux/workflows/reducer";
import {hasNoValue} from "../../../../../../components/inputs/inputHelpers";

interface IProps {
    open: boolean
    onClose: () => any
    docs: IDocument[]
    gatewayDocuments: GatewayDocument[]
    workflow: IWorkflow
}

const DocsUpdater = ({open, onClose, gatewayDocuments, workflow}: IProps) => {

    const docs = gatewayDocuments.map(it => ({value: it.code, label: it.name}));
    docs.push({
        value: 'passportPhoto',
        label: 'Passport Photo',
    })
    const [docType, setDocType] = useState<string>('')
    const [files, setFiles] = useState<FileList | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch()

    function updateCaseDocs(doc: any) {
        const url = `${remoteRoutes.documentsDownload}/${doc.id}`
        downLoad(url, blobResp => {
            dispatch(saveDocument({id: doc.id, url: URL.createObjectURL(blobResp)}))
            dispatch(updateWorkflowDocs(doc))
            onClose()
        })
    }

    function handleSubmit() {
        if (files === null) {
            Toast.info("Please select a file")
            return
        }
        if (docType === null || hasNoValue(docType)) {
            Toast.info("Please select a document type")
            return
        }
        setLoading(true)
        let formData = new FormData()
        formData.append('file', files[0])
        formData.append('fileName', docType)
        formData.append('caseId', workflow.id)
        postFile(remoteRoutes.workflowsDocsUpload, formData, resp => {
            Toast.info("Upload complete")
            updateCaseDocs(resp)
            setFiles(null)
            setDocType("")
        }, undefined, () => {
            setLoading(false)
        })
    }

    return (
        <EditDialog onClose={onClose} open={open} title="Update case files" disableBackdropClick={true}>
            <Grid container>
                <Grid item xs={6}>
                    <Box p={2}>
                        <PSelectInput
                            disabled={loading}
                            variant='outlined'
                            label='Category'
                            onChange={(evt: any) => setDocType(evt.target.value)}
                            options={docs}
                            value={docType}
                        />
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box p={2}>
                        <TextField
                            disabled={loading}
                            fullWidth
                            variant="outlined"
                            type='file'
                            onChange={(evt: any) => setFiles(evt.target.files)}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box p={2} display='flex' justifyContent='flex-end'>
                        <Button
                            disabled={loading}
                            variant='outlined'
                            color='default'
                            onClick={onClose}>Cancel</Button>
                        &nbsp;&nbsp;
                        <Button
                            disabled={loading}
                            variant='outlined'
                            color='primary'
                            onClick={handleSubmit}>Submit</Button>
                    </Box>
                </Grid>
            </Grid>
        </EditDialog>
    );
}

export default DocsUpdater;
