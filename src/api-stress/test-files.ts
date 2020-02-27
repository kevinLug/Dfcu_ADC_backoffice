import fs from 'fs'
import {remoteRoutes} from "../data/constants";

const tus = require('tus-js-client')
const AdmZip = require('adm-zip')
const fetch = require('node-fetch')
const querystring = require('querystring')


const caseId = 'fake-case'
const jpegFile = `${__dirname}\\data\\${caseId}-photo.jpg`
const pdfFile = `${__dirname}\\data\\${caseId}-form.pdf`
const jsonFile = `${__dirname}\\data\\${caseId}-json.json`

const zipName = `${caseId}-data.zip`
const zipFile = `${__dirname}\\data\\${zipName}`


export const createJsonFile = (caseData: any, callBack: () => any) => {
    const text = JSON.stringify(caseData, null, 2)
    fs.writeFile(jsonFile, text, function (err) {
        if (err) throw err
        console.log('Json File is created successfully.')
        callBack()
    })
}

export const createZipFile = (callBack: () => any) => {
    const zip = new AdmZip()
    zip.addLocalFile(jpegFile)
    zip.addLocalFile(pdfFile)
    zip.addLocalFile(jsonFile)
    zip.writeZip(zipFile, callBack)
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


