import React from "react";
import CsvReader from "../../modules/settings/customClaims/CsvReader";
import {action} from "@storybook/addon-actions";


export default {
    title: 'CSV Reader',
    component: CsvReader,
};

export const SimpleReader = () => {
    return <CsvReader done={action('clicked')}/>
}
