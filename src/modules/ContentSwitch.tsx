import React, {useEffect} from "react"
import {Link, Route, Switch} from 'react-router-dom'
import {localRoutes, remoteRoutes} from "../data/constants";
import Dashboard from "./dashboard/Dashboard";
import Contacts from "./contacts/list/Contacts";
import ContactDetails from "./contacts/details/Details";
import ApplicationDetails from "./workflows/details/Details";
import Settings from "./settings/Settings";
import Workflows from "./workflows/Workflows";
import Users from "./settings/users/List";
import UserDetails from "./settings/users/Details";
import Layout from "../components/Layout";
import {useDispatch} from "react-redux";
import {loadMetadata} from "../data/redux/coreActions";
import {search} from "../utils/ajax";


const ContentSwitch = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        search(remoteRoutes.gatewayMetadata, {}, resp => {
            dispatch(loadMetadata(resp))
        })
    }, [dispatch])
    return <Switch>
        <Route exact={true} path="/" component={Workflows}/>
        <Route path={localRoutes.dashboard} component={Dashboard}/>
        <Route path={localRoutes.contactsDetails} component={ContactDetails}/>
        <Route path={localRoutes.contacts} component={Contacts}/>
        <Route path={localRoutes.applicationsDetails} component={ApplicationDetails}/>
        <Route path={localRoutes.applications} component={Workflows}/>
        <Route path={localRoutes.settings} component={Settings}/>
        <Route path={localRoutes.usersDetails} component={UserDetails}/>
        <Route path={localRoutes.users} component={Users}/>
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
