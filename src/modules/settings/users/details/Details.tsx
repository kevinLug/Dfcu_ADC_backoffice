import React, {useEffect, useState} from 'react';
import {RouteComponentProps, withRouter} from "react-router";
import Layout from "../../../../components/Layout";
import {getRouteParam} from "../../../../utils/routHelpers";

import Loading from "../../../../components/Loading";
import Error from "../../../../components/Error";
import {Grid} from "@material-ui/core";

import {get} from "../../../../utils/ajax";
import {remoteRoutes} from "../../../../data/constants";
import {useDispatch, useSelector} from "react-redux";
import {IUserView} from "../types";
import {userCommitFetch} from "../../../../data/redux/users/reducer";
import {IState} from "../../../../data/types";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import {trimCaseId} from "../../../workflows/types";
import Divider from "@material-ui/core/Divider";
import {camelPad} from "../../../../utils/stringHelpers";
import ClaimsList from "./ClaimsList";
import ListView from "../../../../components/dynamic-editor/ListView";

interface IProps extends RouteComponentProps {

}

export const basicData = (data: any): any[] => {
    const display: any[] = []
    for (const key of Object.keys(data)) {
        if (typeof data[key] !== 'object') {
            const v: string = data[key]
            display.push({
                name: camelPad(key),
                value: `${v}`
            })
        }

    }
    return display
}

export const toData = ({claims: data}: any): any[] => {
    const display: any[] = []
    for (const key of Object.keys(data)) {
        if (typeof data[key] !== 'object') {
            const v: string = data[key]
            display.push({
                name: key,
                value: v
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

    function handleAdd() {

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
                            <ListView
                                title='Basic Information'
                                data={basicData(data)}
                                columns={[
                                    {name: 'name', label: 'Name'},
                                    {name: 'value', label: 'Value'}
                                ]}
                                primaryKey='name'
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <ClaimsList data={data.claimsList}/>
                        </Grid>
                    </Grid>
                </Box>
            }
        </Layout>
    );
}

export default withRouter(Details);
