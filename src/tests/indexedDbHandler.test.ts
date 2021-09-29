import ObjectHelpersFluent from "../utils/objectHelpersFluent";
import aCase from "./aCase.json";
import {CriteriaTest} from "../utils/objectHelpers";
import idbHandler from "../data/indexed-db/indexedDbHandler";

describe('idb handler', () => {
    it('idb-handler', () => {
       console.log(idbHandler.isSupported())
    });


})