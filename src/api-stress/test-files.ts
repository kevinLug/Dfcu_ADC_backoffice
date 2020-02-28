import fs from 'fs'
import path from 'path'
import {remoteRoutes} from "../data/constants";
import {GatewayDocument} from "../data/types";

const tus = require('tus-js-client')
const AdmZip = require('adm-zip')

const caseId = 'fake-case'
const jpegFile = `${__dirname}\\sample\\${caseId}-photo.jpg`
const pdfFile = `${__dirname}\\sample\\${caseId}-form.pdf`
const jsonFile = `${__dirname}\\data\\${caseId}-json.json`

const zipName = `${caseId}-data.zip`
const zipFile = `${__dirname}\\data\\${zipName}`


export const createJsonFile = (caseData: any) => {
    const text = JSON.stringify(caseData, null, 2)
    fs.writeFileSync(jsonFile, text)
    console.log('Json File is created successfully.')
}

export const createZipFile = (docsList: GatewayDocument[] ): string => {
    const zip = new AdmZip()
    zip.addLocalFile(jpegFile)
    zip.addLocalFile(jsonFile)
    // randomly chose from optional docs
    docsList.forEach(it=>{
        const newFile = `${__dirname}\\data\\file-${it.code}.pdf`
        if (!fs.existsSync(newFile)) {
            fs.copyFileSync(pdfFile, newFile);
        }
        zip.addLocalFile(newFile)
    })
    zip.writeZip(zipFile)
    return zipFile
}

export const uploadFile = (token: string, callBack: () => any) => {
    const file = fs.createReadStream(zipFile)
    const size = fs.statSync(zipFile).size
    const options = {
        endpoint: remoteRoutes.gatewayUpload,
        resume: true,
        metadata: {
            filename: zipName,
            filetype: "application/zip"
        },
        headers: {
            'Authorization': `Bearer ${token}`
        },
        uploadSize: size,
        onError: function (error: any) {
            throw error
        },
        onProgress: function (bytesUploaded: number, bytesTotal: number) {
            const percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
            console.log(bytesUploaded, bytesTotal, percentage + "%")
        },
        onSuccess: function () {
            console.log("Upload finished:", upload.url)
            callBack()
        }
    }
    const upload = new tus.Upload(file, options)
    upload.start()
}


export const uploadZipAsync = (token: string, filePath: string) => {
    return new Promise((resolve, reject) => {
        const fileStats = fs.statSync(filePath)
        const options = {
            endpoint: remoteRoutes.gatewayUpload,
            resume: true,
            metadata: {
                filename: path.basename(filePath),
                filetype: "application/zip"
            },
            headers: {
                'Authorization': `Bearer ${token}`
            },
            uploadSize: fileStats.size,
            onError: function (error: any) {
                reject(error)
            },
            onProgress: function (bytesUploaded: number, bytesTotal: number) {
                const percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
                console.log(bytesUploaded, bytesTotal, percentage + "%")
            },
            onSuccess: function () {
                console.log("Upload finished:", upload.url)
                resolve(upload.url)
            }
        }
        const upload = new tus.Upload(fs.createReadStream(zipFile), options)

        upload.start()
    })
}


