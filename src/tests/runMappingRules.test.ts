import {List} from "../utils/collections/list";
import RunMappingRules from "../modules/scan/mappings/runMappingRules";
import mappingRules from "../modules/scan/mappings/mappingRules.json";
import validate from "validate.js";
import {getDeepKeys} from "../utils/objectHelpers";
import _ from "lodash";


describe('run mapping rules', () => {

    it('should ', function () {
        const obj = {
            company: {
                name: "laboremus",
                location: "bugolobi",
                person: {
                    name: "Daniel",
                    age: 27
                }
            }
        }

        obj["company"]["name"] = "lab"
        console.log(obj["company"]["name"])

        const t = "case.caseData.transferDetails.branchCode";
        const split = t.split(".");
        let query = "";
        split.map(s => {
            query = query.concat(`[${s}]`)
        })

        console.log(query)

    });

    it('selector method test', () => {

        // console.log(`test...`)
        // console.log(mappingRules)
        const arr = ["F1",
            "F2",
            "F3",
            "X1",
            "X2",
            "X3",
            "X4",
            "X5",
            "X6",
            "X7",
            "X8",
            "X9",
            "Z1",
            "Z2",
            "Z3",
            "Z4",
            "Z5",
            "Z6",
            "Z7",
            "Z8",
            "Z9",
            "Y1",
            "Y2",
            "Y3",
            "Y4",
            "Y5",
            "Y6",
            "Y7",
            "Y8",
            "Y9",
            "T1",
            "T2"];

        const obj = {
            "F1": "41",
            "F2": "05/25/2021",
            "F3": "RTGSLOCAL",
            "X1": "UGX",
            "X2": "2500000",
            "X3": null,
            "X4": null,
            "X5": "UGX - TWO MILLION FIVE HUNDRED THOUSAND ONLY.",
            "X6": "DANIEL COMBONI",
            "X7": "BUGOLOBI",
            "X8": "UG",
            "X9": "BUGOLOBI, PLOT-1253, NICE HOUS",
            "Z1": "12345678912345",
            "Z2": "STANBIC BANK",
            "Z3": "12345",
            "Z4": null,
            "Z5": null,
            "Z6": null,
            "Z7": null,
            "Z8": null,
            "Z9": "EZOKULYA",
            "Y1": "OUR",
            "Y2": "MWESIGWA ENOCK OMUBEDE",
            "Y3": "BU-1234",
            "Y4": "KALUNGI RD",
            "Y5": "BUKASA",
            "Y6": "KAMPALA",
            "Y7": "enockmwesigwa@testmail.com",
            "Y8": "12345678912345",
            "Y9": "0780750721",
            "T1": "MULIMI",
            "T2": null
        };

        // const list = new List<string>().arrayToList(arr);
        // const r = new RunMappingRules()
        // r.getScanResult(JSON.stringify(obj), list)
        // console.log("obj:", RunMappingRules.objCreated);
        // RunMappingRules.runKeysAgainstMappingRules(list);


        // console.log('tttttttttttttt:',getDeepKeys(mappingRules))

        const array = [
                { property: "personal_info.address.city", description: "Missing field" },
                { property: "personal_info.address.country", description: "Missing field" },
            ],
            object = array.reduce((o, { property, description }) => _.set(o, property, description), {});

        console.log(object);


        // expect(v.selector).toEqual("$")
    });

})