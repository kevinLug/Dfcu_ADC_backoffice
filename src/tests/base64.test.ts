import Base64Handler from "../utils/base64";
import {bas64} from './base64.json'
import base64 from "./base64.json";
import {Buffer} from "buffer";

describe('base64 test', () => {
    it('base64 to Buffer', () => {

        const b = new Base64Handler()
        // console.log(b.stringToBase64(""))

        const buffer = Buffer.from("Hello World!").toString('base64')
        // console.log(buffer)
        //
        // console.log(b.base64ToBinary(buffer))

        const encodedData = window.btoa('Hello, world'); // encode a string
        const decodedData = window.atob(encodedData); // decode the string

        console.log(encodedData)
        console.log(decodedData)

        const bb = new Buffer('Hello World',"base64")
        console.log()
        console.log(bb)


    })
})