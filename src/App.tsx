import React, {Fragment} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {ToastContainer} from "react-toastify";
import ContentSwitch from "./modules/ContentSwitch";
import Login from "./modules/login/LoginOidc";
import Splash from "./modules/login/Splash";
import {useSelector} from 'react-redux'
import {UserState} from "redux-oidc";
import {localRoutes} from "./data/constants";
import CallbackPage from "./modules/login/CallbackPage";

const App: React.FC = () => {
    const authState: UserState = useSelector((state: any) => state.oidc)
    console.log("Rendering user", authState)
    const {isLoadingUser, user} = authState
    if (isLoadingUser) {
        return <Splash/>
    } else {
        return <Router>
            <ToastContainer/>
            <Fragment>
                {user ?
                    <ContentSwitch/> :
                    <Switch>
                        <Route path={localRoutes.callback} component={CallbackPage}/>
                        <Route exact component={Login}/>
                    </Switch>
                }
            </Fragment>
        </Router>;
    }
}

export default App;
