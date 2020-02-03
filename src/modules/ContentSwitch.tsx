import React from "react"
import {Link, Route, Switch} from 'react-router-dom'
import {localRoutes} from "../data/constants";
import Dashboard from "./dashboard/Dashboard";
import Contacts from "./contacts/list/Contacts";
import ContactDetails from "./contacts/details/Details";
import ApplicationDetails from "./workflows/details/Details";
import Settings from "./settings/Settings";
import Workflows from "./workflows/Workflows";
import Layout from "../components/Layout";


const ContentSwitch = () => {
    return <Switch>
        <Route exact={true} path="/" component={Workflows}/>
        <Route path={localRoutes.dashboard} component={Dashboard}/>
        <Route path={localRoutes.contactsDetails} component={ContactDetails}/>
        <Route path={localRoutes.contacts} component={Contacts}/>
        <Route path={localRoutes.applicationsDetails} component={ApplicationDetails}/>
        <Route path={localRoutes.applications} component={Workflows}/>
        <Route path={localRoutes.settings} component={Settings}/>
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
