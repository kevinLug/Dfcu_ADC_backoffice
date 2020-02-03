import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {ToastContainer} from "react-toastify";
import ContentSwitch from "./modules/ContentSwitch";
import Login from "./modules/login/LoginSimple";
import Splash from "./modules/login/Splash";
import {useSelector} from 'react-redux'
import {ICoreState} from "./data/redux/coreReducer";


const App: React.FC = () => {
    console.log("Starting App")
    const authState: ICoreState = useSelector((state: any) => state.core)
    const {isLoading, user} = authState
    if (isLoading) {
        return <Splash/>
    } else {
        return <Router>
            <ToastContainer/>
            <>
                {user ?
                    <ContentSwitch/> :
                    <Switch>
                        <Route exact component={Login}/>
                    </Switch>
                }
            </>
        </Router>;
    }
}

export default App;
