import { MultiFormatReader, BarcodeFormat, BinaryBitmap, DecodeHintType, HybridBinarizer, RGBLuminanceSource } from "@zxing/library";
import QrScanner from "qr-scanner";
import jsQR from "jsqr";

const hints = new Map();
const formats = [BarcodeFormat.QR_CODE, BarcodeFormat.DATA_MATRIX];

hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

const reader = new MultiFormatReader();

reader.setHints(hints);

export class ScanAttempt {
  static decodeWithMultiFormatReader(imgByteArray: any, imgWidth: any, imgHeight: any) {
    const luminanceSource = new RGBLuminanceSource(imgByteArray, imgWidth, imgHeight);

    const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));
    return reader.decode(binaryBitmap);
  }

  static async decodeWithQrScanner(image: any) {
    QrScanner.scanImage(image)
      .then((r) => console.log("rrrr:", r))
      .catch((e) => console.log("eer:", { e }));
  }

  static decodeWithJsQr(imageData: ImageData, width: any, height: any) {
    const code = jsQR(imageData.data, width, height);
    if (code) {
      return code.data;
    }
    return null;
  }
}

export default ScanAttempt;
