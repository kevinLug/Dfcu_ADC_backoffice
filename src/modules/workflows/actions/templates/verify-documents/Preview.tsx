import React from 'react';
import {IDocument} from "../../../types";
import DocsView from "./DocsView";
import DocumentsDialog from "./DocumentsDialog";

interface IProps {
    open: boolean
    onClose: () => any
    docs: IDocument[]
}

export default function Preview({open, onClose, docs}: IProps) {
    return (
        <DocumentsDialog onClose={onClose} open={open} small={true}>
            <DocsView docs={docs}/>
        </DocumentsDialog>
    );
}

