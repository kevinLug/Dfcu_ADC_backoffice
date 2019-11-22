import React, {useState} from 'react';
import Grid from "@material-ui/core/Grid";
import InfoIcon from "@material-ui/icons/Info";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import {ActionStatus, sampleDocuments} from "../../../types";
import DataValue from "../../../../../components/DataValue";
import {Flex} from "../../../../../components/widgets";
import {errorColor, successColor, warningColor} from "../../../../../theme/custom-colors";
import {Button} from "@material-ui/core";
import Preview from "./Preview";
import Verify from "./Verify";
import ITemplateProps from "../ITemplateProps";
import {docMetadata} from "./documentsRules";
import Box from "@material-ui/core/Box";


interface Document {
    id: string
    name: string
    type: string
    contentType: string
    sizeInMbs: number
}


const Index= (props: ITemplateProps) => {
    const {action} = props
    const docs = sampleDocuments
    const [preview, setPreview] = useState(false)
    const [verify, setVerify] = useState(false)

    function previewDocs() {
        setPreview(true)
    }

    function verifyDocs() {
        setVerify(true)
    }

    function closePreview() {
        return setPreview(false);
    }

    function closeVerify() {
        return setVerify(false);
    }

    const isPending = action.status === ActionStatus.Pending
    const isDone = action.status === ActionStatus.Done
    let color = warningColor
    if (action.status === ActionStatus.Error) {
        color = errorColor
    } else if (action.status === ActionStatus.Done) {
        color = successColor
    }
    const dataString = action.outputData
    let data: any = JSON.parse(dataString);
    if (!data) {
        data = {}
    }

    return (
        <Grid container spacing={0}>
            {
                !isPending &&
                <>
                    <Grid item xs={12}>
                        <Box display='flex' mb={2}>
                        <Flex>
                            <DataValue style={{color: isDone?null:errorColor}}>
                                {isDone ? 'Documents Approved' : 'Documents rejected'} : {data['remarks']}
                            </DataValue>
                        </Flex>
                        </Box>
                    </Grid>
                </>
            }
            {
                docMetadata.map(it => {
                    const checked = data[it.name]
                    return <Grid item xs={12} sm={6} key={it.name}>
                        <Flex>
                            <div style={{paddingTop: 3}}>
                                <DataValue>
                                    {
                                        checked ?
                                            <CheckCircleIcon fontSize='inherit' style={{color: successColor}}/> :
                                            <InfoIcon fontSize='inherit' style={{color}}/>
                                    }
                                    &nbsp;&nbsp;
                                </DataValue>
                            </div>
                            <DataValue>
                                {it.text}
                            </DataValue>
                        </Flex>
                    </Grid>
                })
            }
            <Grid item xs={12}>
                <Grid container spacing={2} alignContent='flex-end' justify='flex-end'>
                    <Grid item>
                        <Button variant="outlined" size="small" color="primary" onClick={previewDocs}>
                            Preview
                        </Button>
                    </Grid>
                    {
                        isPending &&
                        <Grid item>
                            <Button variant="outlined" size="small" color="primary" onClick={verifyDocs}>
                                Verify
                            </Button>
                        </Grid>
                    }
                </Grid>
                <Preview open={preview} onClose={closePreview} docs={docs}/>
                <Verify open={verify}
                        onClose={closeVerify}
                        docs={docs}
                        action={props.action}
                        workflowId={props.workflowId}
                        taskName={props.taskName}
                />
            </Grid>
        </Grid>
    );
}

export default Index;
