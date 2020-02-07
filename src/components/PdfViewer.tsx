import React from 'react';
import {createStyles, makeStyles, Theme} from "@material-ui/core";


interface IProps {
    data: string
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

const PdfViewer = ({data}: IProps) => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <iframe src={data} className={classes.iframe} scrolling='no'/>
        </div>
    );
}


export default PdfViewer;
