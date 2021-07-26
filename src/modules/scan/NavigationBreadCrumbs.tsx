import React from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {KeyValueMap} from "../../utils/collections/map";
import {localRoutes} from "../../data/constants";
import ApplicationLink from "../../components/links/ApplicationLink";

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


function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}

const NavigationBreadCrumbs = () => {

    const classes = useStyles();

    function mapOfRoutesToBreadCrumbNames() {

        const map = new KeyValueMap<string, string>();

        map.put(localRoutes.homePage, "Home")
        map.put(localRoutes.initiateTransferRequest, "Initiate transfer")
        map.put(localRoutes.applicationsDetails, "Application details")

        // <ApplicationLink id={rec.id} name={rec.referenceNumber}/>
        const pathname = window.location.pathname
        if (pathname === "/" || pathname === "") {
            return ""
            // return <Link key={0} color="inherit" href={map.getKeys().get(0)}>Home</Link>
        }

        const pathNameSplit = pathname.split("/")

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

        // for (const mapElement of map) {
        //     console.log("p-2:", mapElement)
        //     if (!pathNameSplit.includes(mapElement.key)) {
        //         map.remove(mapElement.key)
        //     }
        // }

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

                {/*<Link color="inherit" href="/" onClick={handleClick}>*/}
                {/*    Material-UI*/}
                {/*</Link>*/}
                {/*<Link color="inherit" href="/getting-started/installation/" onClick={handleClick}>*/}
                {/*    Core*/}
                {/*</Link>*/}
                {/*<Typography color="textPrimary">Breadcrumb</Typography>*/}
            </Breadcrumbs>
        </div>
    );
}

export default NavigationBreadCrumbs
