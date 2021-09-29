import React from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {KeyValueMap} from "../../utils/collections/map";
import {localRoutes} from "../../data/constants";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& > * + *': {
                marginTop: theme.spacing(2),
                marginBottom: theme.spacing(2),
                margin: theme.spacing(2)
            },
        },
    }),
);

const NavigationBreadCrumbs = () => {

    const classes = useStyles();

    function mapOfRoutesToBreadCrumbNames() {

        const map = new KeyValueMap<string, string>();

        map.put(localRoutes.homePage, "Home")
        map.put(localRoutes.initiateTransferRequest, "Initiate transfer")
        map.put(localRoutes.applicationsDetails, "Application details")

        const pathname = window.location.pathname
        if (pathname === "/" || pathname === "") {
            return ""
        }

        const pathNameSplit = pathname.split("/")

        // eslint-disable-next-line array-callback-return
        pathNameSplit.map((p) => {
            console.log("p:", p)
            if (p.toLowerCase().includes('application')) {
                map.remove(localRoutes.applicationsDetails)
                map.put(pathname, 'Application details')
            }
        })

        const finalMap = new KeyValueMap<string, string>()
        // @ts-ignore
        finalMap.put(localRoutes.homePage, 'Home')
        // @ts-ignore
        finalMap.put(pathname, map.get(pathname))

        return finalMap.getKeys().toArray().map((m, index) => {
            return <Link key={index} color="inherit" href={m}>{map.get(m)}</Link>
        })

    }

    return (
        <div className={classes.root}>

            <Breadcrumbs separator={<NavigateNextIcon fontSize="small"/>} aria-label="breadcrumb">

                {
                    mapOfRoutesToBreadCrumbNames()
                }

            </Breadcrumbs>
        </div>
    );
}

export default NavigationBreadCrumbs
