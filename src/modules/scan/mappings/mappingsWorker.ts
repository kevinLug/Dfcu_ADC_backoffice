import RunMappingRules from "./runMappingRules";

const mappingsWorker = () => {

    // eslint-disable-next-line no-restricted-globals
    self.onmessage =  function (e: MessageEvent) {

        console.log('mess:',e.data)
        const runMappingRules = new RunMappingRules();

        const resultOfScan = runMappingRules.getScanResult(e.data.decodedRawResult);
        console.log('result of--2: ', resultOfScan);

        // @ts-ignore
        // eslint-disable-next-line no-restricted-globals
        // self.postMessage(resultOfScan);

        // setInterval(() => {
        //
        //     sum = sum + e.data
        //
        //     // @ts-ignore
        //     // eslint-disable-next-line no-restricted-globals
        //     self.postMessage(sum);
        //     observerUserActivity()
        // }, 1000)

    }
};

let code = mappingsWorker.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));
const blob = new Blob([code], {type: "application/javascript"});
const worker_script_mappings = URL.createObjectURL(blob);

// module.exports = worker_script;

export default worker_script_mappings