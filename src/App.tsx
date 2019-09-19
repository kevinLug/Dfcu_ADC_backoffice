import React, {Fragment} from 'react';
import {HashRouter as Router} from 'react-router-dom';
import {ToastContainer} from "react-toastify";
import ContentSwitch from "./modules/ContentSwitch";
import Login from "./modules/login/Login";
import Splash from "./modules/login/Splash";
import {useSelector} from 'react-redux'

const App: React.FC = () => {
    const {splash, user} = useSelector((state: any) => state.core)

    if (splash) {
        return <Splash/>
    } else
        if (user) {
        return (
            <Router>
                <Fragment>
                    <ToastContainer/>
                    <ContentSwitch/>
                </Fragment>
            </Router>
        );
    } else {
        return <Fragment>
            <ToastContainer/>
            <Login/>
        </Fragment>
    }
}

export default App;
