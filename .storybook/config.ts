import {configure, addDecorator} from "@storybook/react";
import {withInfo} from "@storybook/addon-info";

const withInfoX: any = withInfo
// // automatically import all files ending in *.stories.tsx
// const req = require.context("../src", true, /.stories.tsx$/);
//
// function loadStories() {
//     addDecorator(withInfoX);
//     req.keys().forEach(req);
// }

configure(require.context("../src", true, /.stories.tsx$/), module);
