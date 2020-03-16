import React from "react";
import CsvReader from "../../modules/settings/customClaims/CsvReader";


export default {
    title: 'CSV Reader',
    component: CsvReader,
};

export const SimpleReader = () => {
    return <CsvReader/>
}
