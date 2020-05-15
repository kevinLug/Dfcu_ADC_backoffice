import React from 'react';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import {docMetadata} from "./documentsRules";
import DataValue from "../../../../../components/DataValue";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import {successColor} from "../../../../../theme/custom-colors";
import InfoIcon from "@material-ui/icons/Info";
import ITemplateProps from "../ITemplateProps";

interface IProps {
    color:any
}

const DocumentsChecks = (props: ITemplateProps &IProps) => {
    const {action, color} = props

    const dataString = action.outputData
    let data: any = JSON.parse(dataString);
    if (!data) {
        data = {}
    }
    return (
        <div>
            <Box pb={1}>
                <Typography variant='body2'><b>Checks</b></Typography>
            </Box>
            {
                docMetadata.map(it => {
                    const checked = data[it.name]
                    return <Box display='flex' key={it.name}>
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
                    </Box>
                })
            }
        </div>
    );
}


export default DocumentsChecks;
