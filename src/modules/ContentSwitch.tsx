import React, {useEffect} from "react"
import {Link, Route, Switch} from 'react-router-dom'
import {hasAnyRole, isSystemUser, localRoutes, remoteRoutes, systemRoles} from "../data/constants";
import Dashboard from "./dashboard/Dashboard";
import Contacts from "./contacts/list/Contacts";
import ContactDetails from "./contacts/details/Details";
import ApplicationDetails from "./workflows/details/Details";
import Settings from "./settings/Settings";
import Workflows from "./workflows/Workflows";
import Users from "./settings/users/List";
import CustomClaims from "./settings/customClaims/CustomClaimsList";
import CustomClaimsDetails from "./settings/customClaims/details/Details";
import UserDetails from "./settings/users/details/Details";
import Layout from "../components/Layout";
import {useDispatch, useSelector} from "react-redux";
import {loadMetadata} from "../data/redux/coreActions";
import {search} from "../utils/ajax";
import {IState} from "../data/types";
import ErrorMessage from "../components/messages/ErrorMessage";


const ContentSwitch = () => {
    const user = useSelector((state: IState) => state.core.user)
    const dispatch = useDispatch()
    useEffect(() => {
        search(remoteRoutes.gatewayMetadata, {}, resp => {
            dispatch(loadMetadata(resp))
        })
    }, [dispatch])
    if (!isSystemUser(user))
        return <Switch>
            <Route component={NoRoles}/>
        </Switch>
    return <Switch>
        <Route exact={true} path="/" component={Workflows}/>
        <Route path={localRoutes.dashboard} component={Dashboard}/>
        <Route path={localRoutes.contactsDetails} component={ContactDetails}/>
        <Route path={localRoutes.contacts} component={Contacts}/>
        <Route path={localRoutes.applicationsDetails} component={ApplicationDetails}/>
        <Route path={localRoutes.applications} component={Workflows}/>
        <Route path={localRoutes.settings} component={Settings}/>
        {
            hasAnyRole(user, [systemRoles.ADMIN, systemRoles.SUPERVISOR]) &&
            <>
                <Route path={localRoutes.usersDetails} component={UserDetails}/>
                <Route path={localRoutes.users} component={Users}/>

                <Route path={localRoutes.customClaimsDetails} component={CustomClaimsDetails}/>
                <Route path={localRoutes.customClaims} component={CustomClaims}/>
            </>
        }
        <Route component={NoMatch}/>
    </Switch>
}


const NoMatch = () => (
    <Layout>
        <h2>Oops nothing here!!</h2>
        <Link to="/">Take me home</Link>
    </Layout>
)


const NoRoles = () => (
    <Layout>
        <ErrorMessage text="Oops you have no role in this system, please contact your system administrator"/>

    </Layout>
)

export default ContentSwitch
