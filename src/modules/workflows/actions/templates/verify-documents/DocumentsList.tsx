import React from 'react';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import DataValue from "../../../../../components/DataValue";
import FileFilledIcon from "@material-ui/icons/InsertDriveFile";
import FileOutlinedIcon from "@material-ui/icons/InsertDriveFileOutlined";
import {GatewayDocument} from "../../../../../data/types";

interface IProps {
    documents:GatewayDocument[]
}

const DocumentsList = ({documents}: IProps) => {
    return (
        <div>
            <Box pb={1}>
                <Typography variant='body2'><b>Documents</b></Typography>
            </Box>
            <Box>
                {documents.map(
                    it => {
                        return <Box display='flex' key={it.code}>
                            <div style={{paddingTop: 3}}>
                                <DataValue>
                                    {
                                        it.required ?
                                            <FileFilledIcon fontSize='inherit'/> :
                                            <FileOutlinedIcon fontSize='inherit'/>
                                    }
                                    &nbsp;&nbsp;
                                </DataValue>
                            </div>
                            <DataValue>
                                {it.name}
                            </DataValue>
                        </Box>
                    })
                }
            </Box>
        </div>
    );
}


export default DocumentsList;
