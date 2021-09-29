import ObjectHelpersFluent from "../../utils/objectHelpersFluent";

export const testY = (data:any) => {
    // const dataExists =
        new ObjectHelpersFluent()
            .testTitle("Entire data object presence")
            .selector(data, "$")
            .isPresent()
            .logValue()
            .logTestResult()
            .logTestMessage()
            .logNewLineSpace();
}