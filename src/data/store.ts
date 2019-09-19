import {applyMiddleware, combineReducers, createStore} from "redux";
import {createLogger} from 'redux-logger'
import thunk from 'redux-thunk'
import core from "./coreReducer";


const myWindow = window as any;
const toolsName = '__REDUX_DEVTOOLS_EXTENSION__';
const devTools: any = myWindow[toolsName] ? myWindow[toolsName]() : (f: any) => f;


const reducers = combineReducers({core});
const middleware = applyMiddleware(createLogger(), thunk);
const store: any = middleware(devTools(createStore))(reducers);
export default store
