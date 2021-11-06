import { BrowserMultiFormatReader } from "@zxing/library";

class ScanQrCodeHelper {
  static getScanResultTextJsQrCodeResult(croppedImageTuple: [string, ImageBitmap, string]) {
    const str = croppedImageTuple[2];
    if (!str) return null;
    console.log("scan picked using JsQr");
    return str;
  }

  static async getScanResultTextBrowserMultiFormatReader(croppedImageTuple: [string, ImageBitmap, string], codeReader: BrowserMultiFormatReader): Promise<string> {
    const str = croppedImageTuple[0];
    const result = await codeReader.decodeFromImage(undefined, str.toString());
    console.log("scan picked using BrowserMultiFormatReader");
    return result.getText();
  }
}

export default ScanQrCodeHelper;
