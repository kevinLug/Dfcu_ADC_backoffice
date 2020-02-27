import React, {useEffect, useState} from 'react';
import {RouteComponentProps, withRouter} from "react-router";
import Layout from "../../../components/Layout";
import {getRouteParam} from "../../../utils/routHelpers";

import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import {createStyles, Grid, makeStyles, Theme} from "@material-ui/core";

import {get} from "../../../utils/ajax";
import {remoteRoutes} from "../../../data/constants";
import {useDispatch, useSelector} from "react-redux";
import {IUserView} from "./types";
import CodeView from "../../../components/CodeView";
import {userCommitFetch} from "../../../data/redux/users/reducer";
import {IState} from "../../../data/types";
import Box from "@material-ui/core/Box";
import {Flex} from "../../../components/widgets";
import Typography from "@material-ui/core/Typography";
import {trimCaseId} from "../../workflows/types";
import {renderStatus, renderSubStatus} from "../../workflows/widgets";
import {ContactCategory, IContact} from "../../contacts/types";
import DetailView, {IRec} from "../../../components/DetailView";
import {printDate} from "../../../utils/dateHelpers";
import Divider from "@material-ui/core/Divider";

interface IProps extends RouteComponentProps {

}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(1),
            borderRadius: 0,
            minHeight: '100%',
            overflow: 'show'
        },
        divider: {
            marginTop: theme.spacing(2)
        },
        noPadding: {
            padding: 0
        }
    })
);

export const idFields = (data: any): IRec[] => {
    const display: IRec[] = []
    for (const key of Object.keys(data)) {
        if (typeof data[key] !== 'object') {
            const v: string = data[key]
            display.push({
                label: key,
                value: `${v}`
            })
        }

    }
    return display
}

export const claimFields = ({claims:data}: any): IRec[] => {

    const display: IRec[] = []
    for (const key of Object.keys(data)) {
        if (typeof data[key] !== 'object') {
            const v: string = data[key]
            display.push({
                label: key,
                value: `${v}`
            })
        }

    }
    return display
}

const Details = (props: IProps) => {

    const classes = useStyles()
    const dispatch = useDispatch();
    const data: IUserView | undefined = useSelector((state: IState) => state.users.selected)
    const [loading, setLoading] = useState<boolean>(true)
    const userId = getRouteParam(props, 'userId')

    useEffect(() => {
        setLoading(true)
        get(
            `${remoteRoutes.users}/${userId}`,
            resp => dispatch(userCommitFetch(resp)),
            undefined,
            () => setLoading(false))
    }, [dispatch, userId])
    const hasError = !loading && !data
    return (
        <Layout>
            {loading && <Loading/>}
            {hasError && <Error text='Failed load user'/>}
            {
                data &&
                <Box>
                    <Grid container>
                        <Grid item xs={12}>
                            <Flex>
                                <Typography variant='h3'>
                                    User #{trimCaseId(data.id)}
                                </Typography>
                            </Flex>
                            <Divider/>
                        </Grid>
                        <Grid item xs={6}>
                            <Box p={1}>
                                <Typography variant='h6'>
                                    Basic Information
                                </Typography>
                                <Divider/>
                            </Box>
                            <Box p={1}>
                                <DetailView data={idFields(data)}/>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box p={2}>
                                <Typography variant='h6'>
                                    User Claims
                                </Typography>
                                <Divider/>
                            </Box>
                            <Box p={2}>
                                <DetailView data={claimFields(data)}/>
                            </Box>
                        </Grid>
                    </Grid>

                    <CodeView data={data}/>
                </Box>
            }
        </Layout>
    );
}

export default withRouter(Details);
