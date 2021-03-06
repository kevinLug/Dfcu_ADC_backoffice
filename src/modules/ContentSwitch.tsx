import React, {Suspense, useEffect} from "react"
import {Link, Route, Switch} from 'react-router-dom'
import {hasAnyRole, isSystemUser, localRoutes,  systemRoles} from "../data/constants";

import Layout from "../components/Layout";
import {useDispatch, useSelector} from "react-redux";

import {IState} from "../data/types";
import ErrorMessage from "../components/messages/ErrorMessage";
import Loading from "../components/Loading";
import Users from "./settings/users/List"

import InitiateTransfer from "./scan/InitiateTransfer";


const Contacts = React.lazy(() => import("./contacts/list/Contacts"));
const ContactDetails = React.lazy(() => import("./contacts/details/Details"));
const ApplicationDetails = React.lazy(() => import( "./workflows/details/Details"));

const Workflows = React.lazy(() => import("./workflows/Workflows"));
const HomePage = React.lazy(() => import("./scan/HomePage"));

const CustomClaims = React.lazy(() => import("./settings/customClaims/CustomClaimsList"));
const CustomClaimsDetails = React.lazy(() => import("./settings/customClaims/details/Details"));
const UserDetails = React.lazy(() => import("./settings/users/details/Details"));



const ContentSwitch = () => {
    const user = useSelector((state: IState) => state.core.user)
    const dispatch = useDispatch()
    useEffect(() => {

    }, [dispatch])
    if (!isSystemUser(user))
        return <Switch>
            <Route component={NoRoles}/>
        </Switch>
    return <Suspense fallback={<Loading/>}>
        <Switch>
            {
                hasAnyRole(user, [systemRoles.ADMIN]) ?
                    <Route exact={true} path="/" component={Users}/> :

                    <Route exact={true} path="/" component={HomePage}/>
            }
            <Route path={localRoutes.contactsDetails} component={ContactDetails}/>
            <Route path={localRoutes.contacts} component={Contacts} />
            <Route path={localRoutes.applicationsDetails} component={ApplicationDetails}/>
            <Route path={localRoutes.applications} component={Workflows}/>
            <Route path={localRoutes.usersDetails} component={UserDetails}/>
            <Route path={localRoutes.initiateTransferRequest} component={InitiateTransfer}/>
            {
                hasAnyRole(user, [systemRoles.ADMIN]) &&
                <>
                    <Route path={localRoutes.users} component={Users}/>
                    <Route path={localRoutes.customClaimsDetails} component={CustomClaimsDetails}/>
                    <Route path={localRoutes.customClaims} component={CustomClaims}/>
                </>
            }

            <Route component={NoMatch}/>
        </Switch>
    </Suspense>
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
