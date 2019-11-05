import React,{Fragment} from "react"
import {Link, Route, Switch} from 'react-router-dom'
import {localRoutes} from "../data/constants";
import Dashboard from "./dashboard/Dashboard";
import Contacts from "./contacts/Contacts";
import ContactDetails from "./contacts/details/Details";
import ApplicationDetails from "./applications/details/Details";
import Settings from "./settings/Settings";
import Applications from "./applications/Applications";
import OnBoarding from "./applications/OnBoarding";
import Layout from "../components/Layout";
import CallbackPage from "./login/CallbackPage";


const ContentSwitch = () => {
    return <Switch>
        <Route exact={true} path="/" component={OnBoarding}/>
        <Route path={localRoutes.dashboard} component={Dashboard}/>
        <Route path={localRoutes.contactsDetails} component={ContactDetails}/>
        <Route path={localRoutes.contacts} component={Contacts}/>
        <Route path={localRoutes.applicationsDetails} component={ApplicationDetails}/>
        <Route path={localRoutes.applications} component={Applications}/>
        <Route path={localRoutes.pending} component={OnBoarding}/>
        <Route path={localRoutes.settings} component={Settings}/>
        <Route path={localRoutes.callback} component={CallbackPage}/>
        <Route component={NoMatch}/>
    </Switch>
}


const NoMatch = () => (
    <Layout>
        <h2>Oops nothing here!!</h2>
        <Link to="/">Take me home</Link>
    </Layout>
)

export default ContentSwitch
