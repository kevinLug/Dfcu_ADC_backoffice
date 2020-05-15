import React from "react";

const loader: any = {
    "contact-view": React.lazy(() => import("./contact-view")),
    "base-template": React.lazy(() => import("./base-template")),
    "credit-limit": React.lazy(() => import("./credit-limit")),
    "kyc-check": React.lazy(() => import("./kyc-check/index")),
    "outstanding-loans": React.lazy(() => import("./outstanding-loans")),
    "create-account": React.lazy(() => import("./create-account")),
    "verify-documents": React.lazy(() => import("./verify-documents")),
    "verify-entity-documents": React.lazy(() => import("./verify-documents/verify-entity-documents")),
    "verify-account": React.lazy(() => import("./verify-account")),
    "signature-proof": React.lazy(() => import("./signature-proof")),
    "close-workflow": React.lazy(() => import("./close-workflow")),
    "create-cif": React.lazy(() => import("./create-cif")),
    "entity-metadata-view": React.lazy(() => import("./entity-metadata-view")),
}

export default loader
