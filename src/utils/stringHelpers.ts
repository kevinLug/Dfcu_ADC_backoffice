import {hasNoValue} from "../components/inputs/inputHelpers";
import Toast from "./Toast";
import {isDate} from "date-fns";
import {printDate} from "./dateHelpers";

export const getInitials = (fullName = '') => {
    try {
        if (!fullName)
            return ''
        return fullName.split(' ').map(it => it[0].toUpperCase()).join("")
    } catch (e) {
        return ''
    }
}

export function getRandomStr(max = 16) {
    const letters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let str = '';
    for (let i = 0; i < max; i++) {
        str += letters[Math.floor(Math.random() * max)];
    }
    return str;
}


export function enumToArray(typeData: any) {
    return Object.keys(typeData)
}

export const trimString = (data: string, count = 10) => {
    if (!data)
        return ''
    if (data.length > count)
        return data.substr(0, count) + "..."
    return data
}

export const cleanString = (data: string) => {
    if (!data)
        return ''
    return data.replace(/\s+/g, ' ').trim()
}

// Split pascal case
export function camelPad(str: string) {
    return str
        // Look for long acronyms and filter out the last letter
        .replace(/([A-Z]+)([A-Z][a-z])/g, ' $1 $2')
        // Look for lower-case letters followed by upper-case letters
        .replace(/([a-z\d])([A-Z])/g, '$1 $2')
        // Look for lower-case letters followed by numbers
        .replace(/([a-zA-Z])(\d)/g, '$1 $2')
        .replace(/^./, function (str) {
            return str.toUpperCase();
        })
        // Remove any white space left around the word
        .trim();
}

export function parseCSV(csv: string): any[] {
    try {
        const lines = csv.split("\n");
        const result = [];
        const headers = lines[0].split(",").map(cleanString);
        for (let i = 1; i < lines.length; i++) {
            const obj: any = {};
            if (hasNoValue(lines[i].trim()))
                continue;
            const currentLine = lines[i].split(",").map(cleanString);
            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentLine[j];
            }
            result.push(obj);
        }
        console.log("Parsed CSV",result)
        return result;
    } catch (e) {
        Toast.error("Error parsing csv data")
        console.error(e)
        return []
    }
}

export interface ICsvColumn {
    dataKey: string, title: string
}


export function jsArray2CSV(objectsRaw:any[], colsRaw:ICsvColumn[]) {
    const cols = [{dataKey: 'index', title: "Index"}, ...colsRaw]
    const objArray = objectsRaw.map((it, index) => ({...it, index: (index + 1)}))
    if (objArray.length < 1)
        return false;
    let str = '';
    objArray.forEach(obj => {
        let line = '';
        cols.forEach(({dataKey}:ICsvColumn) => {
            if (line !== '')
                line += ',';
            const value = obj[dataKey];
            line += isDate(value) ? printDate(value) : value;
        });
        str += line + '\r\n';
    });
    let titleStr = '';
    cols.forEach(({title}) => {
        if (titleStr !== '')
            titleStr += ',';
        titleStr += title;
    });
    str = titleStr + '\r\n' + str;
    const a = document.createElement('a');
    const blob = new Blob([str], {'type': 'application/octet-stream'});
    a.href = window.URL.createObjectURL(blob);
    a.download = 'export.csv';
    a.click();
    return true;
}


