import { IList, List } from "../../utils/collections/list";
// import { KeyValueMap, IKeyValueMap } from "../../utils/collections/map";
// import { IDfcuBankBranchDefault, ConstantLabelsAndValues, IDfcuBankBranch } from "../constants";
// import IndexedDbManager, { IIndex } from "./IndexedDbManager";

// export class BranchRepository {
//   private branchMap: IKeyValueMap<string, IDfcuBankBranch>;
//   private branchNamesOnly: IKeyValueMap<string, string>;

//   private static branchNames: IKeyValueMap<string, string> = new KeyValueMap<string, string>();

//   static setBranchNames(branchNames: IKeyValueMap<string, string>) {
//     BranchRepository.branchNames = branchNames;
//   }

//   static getBranchNames() {
//     return BranchRepository.branchNames;
//   }

//   constructor() {
//     this.branchMap = new KeyValueMap<string, IDfcuBankBranch>();
//     this.branchNamesOnly = new KeyValueMap<string, string>();
//   }

//   setBranchNamesOnly(branchNames: IKeyValueMap<string, string>) {
//     this.branchNamesOnly = branchNames;
//   }

//   getBranchNamesOnly() {
//     return this.branchNamesOnly;
//   }

//   setBranchMap(map: IKeyValueMap<string, IDfcuBankBranch>) {
//     this.branchMap = map;
//   }

//   getBranchMap() {
//     return this.branchMap;
//   }

//   createIndices() {
//     const indicesNames = Object.keys(IDfcuBankBranchDefault);
//     const indices = new Array<IIndex>();
//     indicesNames.map((v) => {
//       const index: IIndex = {
//         name: v,
//         path: v,
//         unique: true,
//       };
//       indices.concat(index);
//     });
//     return indices;
//   }

//   async checkBranchesInPlace() {
//     const idb = new IndexedDbManager(ConstantLabelsAndValues.BRANCH_DB);
//     await idb.createObjectStore([ConstantLabelsAndValues.BRANCH_STORE], this.createIndices());

//     const allRecords = await idb.getAllValue(ConstantLabelsAndValues.BRANCH_STORE);
//     const list = new List<IDfcuBankBranch>();
//     const map = new KeyValueMap<string, IDfcuBankBranch>();

//     list.arrayToList(allRecords);

//     for (const element of list) {
//       map.put(element.branchCode, element);
//     }

//     const listMapTuple: [IList<IDfcuBankBranch>, IKeyValueMap<string, IDfcuBankBranch>] = [list, map];

//     return listMapTuple;
//   }

//   async updateBranch(branchCode: string) {
//     const idb = new IndexedDbManager(ConstantLabelsAndValues.BRANCH_DB);
//     await idb.getValue(ConstantLabelsAndValues.BRANCH_STORE, branchCode);
//     // const newData: IDfcuBankBranch = await idb.getValue(ConstantLabelsAndValues.BRANCH_STORE, branchCode);
//     // newData.isSelected = true;

//     // const idb2 = new IndexedDbManager(ConstantLabelsAndValues.BRANCH_DB);
//     // await idb2.putValue(ConstantLabelsAndValues.BRANCH_STORE, newData);
//     // return await idb2.getValue(ConstantLabelsAndValues.BRANCH_STORE, branchCode);
//   }

//   async createBranchDb() {
//     const idb = new IndexedDbManager(ConstantLabelsAndValues.BRANCH_DB);

//     return idb
//       .createObjectStore([ConstantLabelsAndValues.BRANCH_STORE], this.createIndices())
//       .then(() => {
//         this.checkBranchesInPlace().then((tuple) => {
//           const map = tuple[1];

//           if (map.size() > 0) {
//             for (const preDefinedBranch of ConstantLabelsAndValues.mapOfDFCUBranchCodeToBranchLabel()) {
//               if (!map.containsKey(preDefinedBranch.key)) {
//                 idb.putValue(ConstantLabelsAndValues.BRANCH_STORE, { branchCode: preDefinedBranch.key, branchName: preDefinedBranch.value, isSelected: false });
//                 console.log("adding non-existentadding...appending");
//               }
//             }
//           } else {
//             for (const aRecord of ConstantLabelsAndValues.mapOfDFCUBranchCodeToBranchLabel()) {
//               console.log("adding...afresh");
//               idb.putValue(ConstantLabelsAndValues.BRANCH_STORE, { branchCode: aRecord.key, branchName: aRecord.value, isSelected: false });
//             }
//           }
//         });
//       })
//       .then(async () => {
//         const tupleListMap = await Promise.all(await this.checkBranchesInPlace());
//         this.setBranchMap(tupleListMap[1]);

//         // const tuple = await this.checkBranchesInPlace();
//         // this.setBranchMap(tuple[1]);

//         const list = this.getBranchMap().getValues();
//         const kv = new KeyValueMap<string, string>();
//         for (const element of list) {
//           kv.put(element.branchName, element.branchName);
//         }

//         BranchRepository.setBranchNames(kv);
//         this.setBranchNamesOnly(kv);
//         console.log("kv:", BranchRepository.getBranchNames());

//         const returnedTuple: [IKeyValueMap<string, IDfcuBankBranch>, IKeyValueMap<string, string>] = [this.branchMap, kv];
//         return returnedTuple;
//       });
//   }
// }

// export default BranchRepository;
