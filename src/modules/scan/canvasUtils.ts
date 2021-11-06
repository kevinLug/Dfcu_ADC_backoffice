import ScanAttempt from "./ScanAttempts";

const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

export const handleCroppedAreaSnipping = (image: HTMLImageElement, pixelCrop: any): Promise<ImageBitmap> => {
  const height = pixelCrop.height;
  const width = pixelCrop.width;
  const x = pixelCrop.x;
  const y = pixelCrop.y;
  return createImageBitmap(image, x, y, width, height);
};

/**
 * returns object URL (blob)
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 * @param imageSrc
 * @param {Object} pixelCrop - pixelCrop Object provided by react-easy-crop
 * @param {number} rotation - optional rotation parameter
 */
export async function getCroppedImg(imageSrc: string, pixelCrop: any, rotation: number = 0): Promise<[string, ImageBitmap, string]> {
  const image = await createImage(imageSrc);

  const croppedArea = await handleCroppedAreaSnipping(image, pixelCrop);

  const canvas = document.createElement("canvas");
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  // set each dimensions to double largest dimension to allow for a safe area for the
  // image to rotate in without being clipped by canvas context
  canvas.width = safeArea;
  canvas.height = safeArea;

  // translate canvas context to a central location on image to allow rotating around the center.
  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate(getRadianAngle(rotation));
  ctx.translate(-safeArea / 2, -safeArea / 2);

  // draw rotated image and store data.
  ctx.drawImage(image, safeArea / 2 - image.width * 0.5, safeArea / 2 - image.height * 0.5);
  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  const firstAttemtpResult = ScanAttempt.decodeWithJsQr(data, data.width, data.height);
  let resultFromFirstAttempt = "";
  if (firstAttemtpResult) {
    resultFromFirstAttempt = firstAttemtpResult;
  }

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image with correct offsets for x,y crop values.
  ctx.putImageData(data, Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x), Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y));

  // As Base64 string
  // return canvas.toDataURL('image/jpeg');

  // As a blob (object url)
  const objUrl = new Promise<string>((resolve) => {
    canvas.toBlob((file) => {
      resolve(URL.createObjectURL(file));
    }, "image/jpeg");
    return resolve;
  });

  return new Promise<[string, ImageBitmap, string]>(async (resolve) => {
    const urlOfObj: string = await objUrl;
    const tuple: [string, ImageBitmap, string] = [urlOfObj, croppedArea, resultFromFirstAttempt];
    return resolve(tuple);
  });
}

export async function getRotatedImage(imageSrc: any, rotation = 0) {
  const image: any = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx: any = canvas.getContext("2d");

  const orientationChanged = rotation === 90 || rotation === -90 || rotation === 270 || rotation === -270;
  if (orientationChanged) {
    canvas.width = image.height;
    canvas.height = image.width;
  } else {
    canvas.width = image.width;
    canvas.height = image.height;
  }

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);

  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve(URL.createObjectURL(file));
    }, "image/jpeg");
  });
}
