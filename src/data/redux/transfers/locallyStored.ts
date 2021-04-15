import {ICase} from "../../../modules/transfers/types";

export const storeCaseLocalStorage = (data: ICase) => {
    localStorage.setItem("aCase",JSON.stringify(data))
}
export const getCaseLocalStorage = () => localStorage.getItem("aCase");

export const clearCaseLocalStorage = () => localStorage.removeItem("aCase")

