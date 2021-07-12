import {applyMiddleware, combineReducers, createStore} from "redux";
import {createLogger} from 'redux-logger'
import ReduxThunk from 'redux-thunk'
import core from "./coreReducer";
import workflows from "./workflows/reducer";
import crm from './contacts/reducer';
import users from './users/reducer';
import {reducer as transfers} from './transfers/reducer'
import {reducer as workflowResponse} from './workflow-response/reducer'
import {reducer as checks} from './checks/reducer'
import {reducer as selects} from './selects/reducer'
import {reducer as pings} from './pings/reducer'

const myWindow = window as any;
const toolsName = '__REDUX_DEVTOOLS_EXTENSION__';
const devTools: any = myWindow[toolsName] ? myWindow[toolsName]() : (f: any) => f;
const reducers = combineReducers({
    core, workflows, crm, users, transfers, workflowResponse, checks, selects, pings
});
const middleware = applyMiddleware(createLogger(), ReduxThunk);
const store: any = middleware(devTools(createStore))(reducers);
export default store
