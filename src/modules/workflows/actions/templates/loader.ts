import React from "react";

const loader: any = {
    "contact-view": React.lazy(() => import("./contact-view")),
    "base-template": React.lazy(() => import("./base-template")),
    "credit-limit": React.lazy(() => import("./credit-limit")),
    "kyc-check": React.lazy(() => import("./kyc-check")),
    "outstanding-loans": React.lazy(() => import("./outstanding-loans")),
    "create-account": React.lazy(() => import("./create-account")),
    "verify-documents": React.lazy(() => import("./verify-documents")),
    "verify-account": React.lazy(() => import("./verify-account")),
}

export default loader
