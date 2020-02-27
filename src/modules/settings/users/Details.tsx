import React, {useEffect, useState} from 'react';
import {RouteComponentProps, withRouter} from "react-router";
import Layout from "../../../components/Layout";
import {getRouteParam} from "../../../utils/routHelpers";

import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import {Grid} from "@material-ui/core";

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
import DetailView, {IRec} from "../../../components/DetailView";
import Divider from "@material-ui/core/Divider";
import {camelPad} from "../../../utils/stringHelpers";
import {hasNoValue} from "../../../components/inputs/inputHelpers";
import XLink from "../../../components/links/XLink";
import EditIconButton from "../../../components/EditIconButton";
import Button from "@material-ui/core/Button";

interface IProps extends RouteComponentProps {

}

export const idFields = (data: any): IRec[] => {
    const display: IRec[] = []
    for (const key of Object.keys(data)) {
        if (typeof data[key] !== 'object') {
            const v: string = data[key]
            display.push({
                label: camelPad(key),
                value: `${v}`
            })
        }

    }
    return display
}

export const parseUrl = (str: string) => {
    if (hasNoValue(str))
        return ''
    const parts = str.split("/")
    if (parts.length > 1) {
        return <XLink name={`.../${parts[parts.length - 1]}`} title={str}/>
    }
    return str
}

export const claimFields = ({claims: data}: any): IRec[] => {

    const display: IRec[] = []
    for (const key of Object.keys(data)) {
        if (typeof data[key] !== 'object') {
            const v: string = data[key]
            display.push({
                label: parseUrl(key),
                value: <Typography noWrap style={{width: 400}}>{`${v}`}</Typography>
            })
        }

    }
    return display
}

const Details = (props: IProps) => {
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

    function handleEdit() {

    }

    return (
        <Layout>
            {loading && <Loading/>}
            {hasError && <Error text='Failed load user'/>}
            {
                data &&
                <Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box pb={1}>
                                <Typography variant='h3'>
                                    User #{trimCaseId(data.id)}
                                </Typography>
                            </Box>
                            <Divider/>
                        </Grid>
                        <Grid item xs={4}>
                            <Box p={1}>
                                <Typography variant='h6'>
                                    Basic Information
                                </Typography>
                            </Box>
                            <Divider/>
                            <Box p={1}>
                                <DetailView data={idFields(data)}/>
                            </Box>
                        </Grid>
                        <Grid item xs={8}>
                            <Box display='flex'>
                                <Box flexGrow={1}>
                                    <Typography variant='h6'>
                                        User Claims
                                    </Typography>
                                </Box>
                                <Box mb={1}>
                                    <Button onClick={handleEdit} size='small' variant='outlined'>Edit</Button>
                                </Box>
                            </Box>
                            <Divider/>
                            <Box p={1}>
                                <DetailView data={claimFields(data)}/>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            }
        </Layout>
    );
}

export default withRouter(Details);
