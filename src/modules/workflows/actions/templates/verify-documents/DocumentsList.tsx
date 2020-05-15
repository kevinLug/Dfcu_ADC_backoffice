import React from 'react';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import DataValue from "../../../../../components/DataValue";
import FileFilledIcon from "@material-ui/icons/InsertDriveFile";
import FileOutlinedIcon from "@material-ui/icons/InsertDriveFileOutlined";
import {GatewayDocument} from "../../../../../data/types";
import {IDocument} from "../../../types";
import {hasValue} from "../../../../../components/inputs/inputHelpers";

interface IProps {
    gatewayDocuments: GatewayDocument[]
    documents: IDocument[]
}

const DocumentsList = ({documents, gatewayDocuments}: IProps) => {

    const getName = (str: string) => {

        if (str.toLocaleLowerCase().indexOf('passportphoto') > -1) {
            return "Passport photo (jpg)"
        }
        const gatewayDocument = gatewayDocuments.filter(it => str.toLocaleLowerCase().indexOf(it.code.toLocaleLowerCase()) > -1)[0]
        if (hasValue(gatewayDocument)) {
            return gatewayDocument.name + ' (pdf)';
        }
        return str;
    }

    return (
        <div>
            <Box pb={1}>
                <Typography variant='body2'><b>Documents</b></Typography>
            </Box>
            <Box>
                {documents.map(
                    it => {
                        return <Box display='flex' key={it.id}>
                            <div style={{paddingTop: 3}}>
                                <DataValue>
                                    <FileOutlinedIcon fontSize='inherit'/>
                                    &nbsp;&nbsp;
                                </DataValue>
                            </div>
                            <DataValue>
                                {getName(it.name)}
                            </DataValue>
                        </Box>
                    })
                }
            </Box>
        </div>
    );
}


export default DocumentsList;
