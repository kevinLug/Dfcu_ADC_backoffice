import React, {useEffect, useState} from 'react';
import {RouteComponentProps, withRouter} from "react-router";
import Navigation from "../../../components/Navigation";
import {getRouteParam} from "../../../utils/routHelpers";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import {createStyles, Grid, makeStyles, Theme} from "@material-ui/core";
import {fakeCase} from "../fakeData";
import {IWorkflow, trimCaseId} from "../types";
import Typography from "@material-ui/core/Typography";
import IBox from "../../../components/ibox/IBox";
import {Flex} from "../../../components/widgets";
import {printWorkflowStatus, printWorkflowSubStatus} from "../widgets";
import Summary from "./Summary";
import WorkflowView from "./WorkflowView";


interface IProps extends RouteComponentProps {

}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            borderRadius: 0,
            padding: theme.spacing(1),
            minHeight: '100%'
        },
        divider: {
            marginTop: theme.spacing(2)
        },
        noPaddingLeft: {
            paddingLeft: 0
        }
    })
);

const Details = (props: IProps) => {
    const contactId = getRouteParam(props, 'caseId')
    const classes = useStyles()
    const [data, setData] = useState<IWorkflow | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setData(fakeCase())
        }, 500)
    }, [contactId])
    const hasError = !loading && !data
    const template = `
    <div class="entry">
      <h1>{{title}}</h1>
      <div class="body">
        {{body}}
      </div>
    </div>`

    return (
        <Navigation>
            {loading && <Loading/>}
            {hasError && <Error text='Failed load case data'/>}
            {
                data &&
                <div className={classes.root} >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Flex>
                                <Typography variant='h4'>
                                    Case #{trimCaseId(data.id)}
                                </Typography>
                                <div style={{marginTop:3}}>&nbsp;&nbsp;{printWorkflowStatus(data.status)}</div>
                                <div style={{marginTop:3}}>&nbsp;&nbsp;{printWorkflowSubStatus(data.subStatus)}</div>
                            </Flex>

                        </Grid>
                        <Grid item xs={12} sm={9}>
                            <IBox
                                title='Details'
                            >
                                <WorkflowView data={data}/>
                            </IBox>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <IBox
                                title='Case Summary'
                            >
                                <Summary data={data}/>
                            </IBox>
                        </Grid>
                    </Grid>
                </div>
            }
        </Navigation>
    );
}

export default withRouter(Details);
