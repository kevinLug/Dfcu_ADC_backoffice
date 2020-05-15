import React from "react"
import {random,range} from 'lodash'
import {Typography} from "@material-ui/core";

export const printMoney = (money: number) => {
    try {
        return money ? <span>
            {new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(money)} <Typography variant='caption'>UGX</Typography>
            </span> : ""
    } catch (e) {
        return ''
    }
}

export const printNumber = (number: number) => {
    try {
        return number ? new Intl.NumberFormat().format(number) : ''
    } catch (e) {
        return ''
    }
}

export const printDecimal = (number: number) => {
    try {
        return number ? new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(number) : ''
    } catch (e) {
        return ''
    }
}

export const printInteger = (number: number) => {
    try {
        return number ? new Intl.NumberFormat('en-US', {maximumFractionDigits: 0}).format(number) : ''
    } catch (e) {
        return ''
    }
}

export const randomInt = (min = 0, max = 10): number => {
    return random(min, max)
}

export const intRange = (min = 0, max = 10): number[] => {
    return range(min, max)
}
