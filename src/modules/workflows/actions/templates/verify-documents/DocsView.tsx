import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import PdfViewer from "../../../../../components/PdfViewer";
import {IDocument} from "../../../types";
import {Divider} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import {useSelector} from "react-redux";
import {IState} from "../../../../../data/types";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        header: {
            height: 50,
        },
        body: {
            height: 'calc(100% - 100px)'
        },
        imgHolder: {
            height: "100%",
            width: '100%',
            textAlign: 'center'
        },
        img: {
            maxWidth: "100%",
            height: 'auto',
            maxHeight: "100%",
            margin: '0 auto'
        },
    }),
);

interface IProps {
    docs: IDocument[]
}

export default function DocsView({docs}: IProps) {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = docs.length;
    const documents = useSelector((state: IState) => state.core.documents)
    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };
    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };
    const document: IDocument = docs[activeStep]
    return (
        <div style={{height: '100%'}}>
            <Paper square elevation={0} className={classes.header}>
                <Typography variant='h5' display='inline'>Documents: <Typography
                    variant="body1" display='inline'>{document.name}</Typography></Typography>
                <Box mt={1}>
                    <Divider/>
                </Box>
            </Paper>
            <div className={classes.body}>
                {
                    document.contentType.indexOf('image') > -1 ? (
                        <div key={document.id} className={classes.imgHolder}>
                            <img
                                className={classes.img}
                                src={documents[document.id]}
                                alt={document.name}
                            />
                        </div>
                    ) : (
                        <PdfViewer key={document.id} data={documents[document.id]}/>
                    )
                }
            </div>
            <MobileStepper
                steps={maxSteps}
                position="static"
                variant="text"
                activeStep={activeStep}
                nextButton={
                    <Button size="small" color='primary' variant='outlined' onClick={handleNext}
                            disabled={activeStep === maxSteps - 1}>
                        Next
                        <KeyboardArrowRight/>
                    </Button>
                }
                backButton={
                    <Button size="small" color='primary' variant='outlined' onClick={handleBack}
                            disabled={activeStep === 0}>
                        <KeyboardArrowLeft/>
                        Back
                    </Button>
                }
            />
        </div>
    );
}
