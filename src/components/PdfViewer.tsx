import React from 'react';
import {createStyles, makeStyles, Theme} from "@material-ui/core";


interface IProps {
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            height: '100%'
        },
        iframe: {
            width: '100%',
            height: '100%',
            border: 'none',
            overflow: 'hidden'
        }
    }),
);

const PdfViewer = (props: IProps) => {
    const classes = useStyles()
    const url = 'http://localhost:6001/sample.pdf'
    return (
        <div className={classes.root}>
            <iframe src={url} className={classes.iframe} scrolling='no'/>
        </div>
    );
}


export default PdfViewer;
