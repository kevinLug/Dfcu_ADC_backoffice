export const base64ToArrayBuffer = (base64Str:string): Uint8Array => Uint8Array.from(atob(base64Str.split(",")[1]), c => c.charCodeAt(0));

export const arrayBufferToBase64 = (arrayBuffer:Uint8Array): Promise<string> => {
    let base64Returned = "";

    return  new Promise<string>(resolve => {
        const blob = new Blob([arrayBuffer])
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = (event: any) => {
            const base64 =   event.target.result
            base64Returned = base64
             resolve(base64Returned);
        };
    })

}