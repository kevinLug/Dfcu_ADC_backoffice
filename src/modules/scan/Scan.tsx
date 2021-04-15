import React, { Component } from "react";

import * as ZXing from "@zxing/library";
import { BrowserMultiFormatReader, BrowserQRCodeReader } from "@zxing/library";

import './video.css'
import Layout from "../../components/Layout";
import { Button, Dialog } from "@material-ui/core";

import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Toast from "../../utils/Toast";



const CameraSelectionPanel = ({ hideVideo, hideResult, result, deviceId, codeReader, cameras, cameraList, open }: IScanQRCodeState) => {
  return (
    <div className="input-group mb-3" id="sourceSelectPanel">
      <div className="input-group-prepend">
        <label className="input-group-text">Camera options</label>
      </div>
      <select className="custom-select" id="sourceSelect">
        {
          cameraList.map((result) => {
            return <option value={result.deviceId} >{result.label}</option>
          })
        }
      </select>
    </div>
  );
};

// video scan result
const VideoScanResult = ({ hideVideo, hideResult, result, deviceId, codeReader, cameras, cameraList, open }: IScanQRCodeState) => {
  return (
    <div className="card" hidden={hideResult} id="result-card-id">
      <h5 className="card-header">decoded result</h5>
      <div className="card-body">
        <p className="card-text" id="result">{result}</p>
      </div>
    </div>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

interface IScanQRCodeState {
  hideVideo: boolean;
  hideResult: boolean;
  result: string;
  deviceId: any;
  codeReader: BrowserQRCodeReader;
  cameras: Promise<MediaDeviceInfo[]>;
  cameraList: Array<MediaDeviceInfo>;
  open: boolean
}

class Scan extends Component<{}, IScanQRCodeState> {

  state: IScanQRCodeState = {
    hideVideo: true,
    hideResult: true,
    result: '',
    deviceId: '',
    codeReader: new BrowserQRCodeReader(),
    cameras: new Promise<MediaDeviceInfo[]>(() => { }),
    cameraList: new Array<MediaDeviceInfo>(),
    open: false
  }

  componentDidMount() {

    this.getAllCameras();

  }

  startScan = (): void => {

   
    this.setState({ hideVideo: false, hideResult: true })

    this.state.codeReader.decodeFromVideoDevice(this.state.deviceId, "video", (result, err) => {

      if (result) {

        this.setState({ hideVideo: true, hideResult: false, result: result.getText(), open: false })
        console.log("the result:", result);
        this.state.codeReader.reset();

      }

      if (err && !(err instanceof ZXing.NotFoundException)) {
        // console.error(err);
        // document.getElementById("result").textContent = err;
      }
    });
    console.log(`Started continous decode from camera with id ${this.state.deviceId}`);
  }

  resetCamera = (): void => {
    this.state.codeReader.reset();
    this.setState({ hideVideo: true, hideResult: true, result: "" })
    console.log("Reset.");
  }

  getAllCameras = () => this.displayCamerasNames(this.state.codeReader);

  displayCamerasNames = (codeReader: BrowserQRCodeReader): void => {

    this.getCameras(codeReader).then((cams) => {

      const sourceSelect = document.getElementById("sourceSelect")! as HTMLSelectElement;

      let camValues = new Map();
      // place camera in Map to avoid repetition
      if (cams.length >= 1) {
        this.setState({ cameraList: cams })
      }

    });
  }

  getCameras = (codeReader: BrowserQRCodeReader): Promise<MediaDeviceInfo[]> => {
    codeReader = new BrowserMultiFormatReader();

    return codeReader.listVideoInputDevices();
  }

  handleClickOpen = () => {
    if (!this.state.deviceId) {
      Toast.warn("please choose a camera first");
      return;
    }
    this.setState({ open: true })
    this.startScan()
  };

  handleClose = () => {
    this.setState({ open: false })
    this.resetCamera();
  };

  handleChange = (event: React.ChangeEvent<{ value: any }>) => {
    // setAge(event.target.value as string);
    this.setState({ deviceId: event.target.value })
    console.log(`on change: `, this.state.deviceId)
  };

  render() {

    // this.getAllCameras();

    return (

      <Layout>

        <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
          Scan
        </Button>

        <Dialog onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={this.state.open} className="dialog">

          <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
            Focus camera to scan qr code
          </DialogTitle>

          <DialogContent dividers className="content">

            <video id="video" width="100%" style={{ zIndex: 1 }}>

            </video>

            <div id="overlay" className="overlay-top"></div>

            <div id="overlay-bottom" className="overlay-bottom"></div>

            <div id="overlay-left" className="overlay-left"></div>

            <div id="overlay-right" className="overlay-right"></div>

          </DialogContent>
        </Dialog>

        <div>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Camera</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={this.state.deviceId}
              onChange={this.handleChange}
            >

              {
                this.state.cameraList.map((val) => {
                  return <MenuItem key={val.deviceId} value={val.deviceId} >{val.label}</MenuItem>
                })
              }

            </Select>
          </FormControl>

        </div>

        <VideoScanResult hideVideo={this.state.hideVideo} hideResult={this.state.hideResult}
          result={this.state.result} deviceId={this.state.deviceId} codeReader={this.state.codeReader} cameras={this.state.cameras} cameraList={this.state.cameraList} open={this.state.open} />
      </Layout>

    );
  }
}

export default Scan
