import {format, isValid} from "date-fns";

export const printDateTime = (value: any): string => {
    if (isValid(value))
        return format(value, 'MM/dd/yyyy p')
    else
        return ''
}

export const printBirthday = (value: any): string => {
    if (isValid(value))
        return format(value, 'dd MMM')
    else
        return ''
}

export const printMonth= (value: any): string => {
    if (isValid(value))
        return format(value, 'MMM')
    else
        return ''
}

export const printDay= (value: any): string => {
    if (isValid(value))
        return format(value, 'dd')
    else
        return ''
}

export const printShortDate = (value: any): string => {
    if (isValid(value))
        return format(value, 'dd MMM')
    else
        return ''
}

export const printDayOfMonth = (value: any): string => {
    if (isValid(value))
        return format(value, 'dd')
    else
        return ''
}


export const printDate = (value: any): string => {
    if (isValid(value))
        return format(value, 'MM/dd/yyyy')
    else
        return ''
}