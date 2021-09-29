// export const arrayBufferToBlob = (arrayBuffer:any) => new Blob([arrayBuffer])

class ImageUtils {
    static arrayBufferToBlob(arrayBuffer:any){
        return new Blob([arrayBuffer])
    }

    static base64ToArrayBuffer(base64Str:string){
        return new Buffer(base64Str.split(",")[1],"base64")
    }

}

export default ImageUtils