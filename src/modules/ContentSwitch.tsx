import React,{Fragment} from "react"
import {Link, Route, Switch} from 'react-router-dom'
import {localRoutes} from "../data/constants";
import Dashboard from "./dashboard/Dashboard";
import Contacts from "./contacts/Contacts";
import ContactDetails from "./contacts/details/Details";
import ApplicationDetails from "./applications/details/Details";
import Settings from "./settings/Settings";
import Applications from "./applications/Applications";
import NewApplications from "./applications/NewApplications";


const ContentSwitch = () => {
    return <Switch>
        <Route exact={true} path="/" component={Dashboard}/>
        <Route path={localRoutes.dashboard} component={Dashboard}/>
        <Route path={localRoutes.dashboard} component={Dashboard}/>
        <Route path={localRoutes.contactsDetails} component={ContactDetails}/>
        <Route path={localRoutes.contacts} component={Contacts}/>
        <Route path={localRoutes.applicationsDetails} component={ApplicationDetails}/>
        <Route path={localRoutes.applications} component={Applications}/>
        <Route path={localRoutes.pending} component={NewApplications}/>
        <Route path={localRoutes.settings} component={Settings}/>
        <Route component={NoMatch}/>
    </Switch>
}


const NoMatch = () => (
    <div>
        <h2>Oops nothing here!!</h2>
        <Link to="/">Take me home</Link>
    </div>
)

export default ContentSwitch
