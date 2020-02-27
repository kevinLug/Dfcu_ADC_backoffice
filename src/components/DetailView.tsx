import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {chunkArray} from "../utils/arrayHelpers";
import DataLabel from "./DataLabel";
import DataValue from "./DataValue";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%'
        },
        row: {
            marginLeft: 0,
            paddingLeft: 0,
            paddingBottom: theme.spacing(2),
        },
        col: {
            marginLeft: 0,
            paddingLeft: 0,
            paddingBottom: theme.spacing(1),
        },
        label: {
            margin: 0,
            paddingLeft: 0,
            paddingRight: theme.spacing(2),
            width: 'auto',
        },
        value: {
            width: '100%',
        }
    }),
);

export interface IRec {
    label: any
    value: any
}

interface IProps {
    data: IRec[]
    columns?: number,
    useGrid?: boolean,
    bold?:boolean
}

const TableView = ({data, useGrid = false,bold=false}: IProps) => {
    const classes = useStyles();
    if (useGrid)
        return (
            <Grid container spacing={0}>
                {data.map(it => (
                    <Grid item xs={12} key={it.label}>
                        <Box display="flex" pb={0}>
                            {
                                bold?
                                    <Box flexGrow={1}>
                                        <Typography variant='body1' noWrap>{it.value}</Typography>
                                        <Typography variant='caption'><b>{it.label}</b></Typography>
                                    </Box>:
                                    <Box flexGrow={1}>
                                        <Typography variant='body1' noWrap>{it.value}</Typography>
                                        <Typography variant='caption'>{it.label}</Typography>
                                    </Box>
                            }
                        </Box>
                    </Grid>
                ))}
            </Grid>
        )
    return (
        <table className={classes.root}>
            <tbody>
            {data.map(row => row.label !== '' ? (
                <tr key={row.label} className={classes.row}>
                    <td className={clsx(classes.col, classes.label)}>
                        <DataLabel bold={bold}>
                            {row.label}
                        </DataLabel>
                    </td>
                    <td className={clsx(classes.col, classes.value)}>
                        <DataValue>
                            {row.value}
                        </DataValue>
                    </td>
                </tr>
            ) : <tr key={row.label} className={classes.row}>
                <td colSpan={2}/>
                &nbsp;</tr>)}
            </tbody>
        </table>
    );
}

const DetailView = ({data, columns, useGrid,bold}: IProps) => {

    if (columns) {
        const parts = chunkArray(data, columns)
        const size: any = 12 / columns
        return (
            <Grid container>
                {
                    parts.map((it, index) => <Grid item xs={size} key={index}>
                        <TableView data={it} useGrid={useGrid} bold={bold}/>
                    </Grid>)
                }
            </Grid>
        );
    } else {
        return <TableView data={data} useGrid={useGrid} bold={bold}/>
    }
}


export default DetailView;


export const DetailViewX = ({data}: IProps) => {
    return (
        <Box>
            {
                data.map((rec, index) => (
                    <Box display='flex' key={rec.label} pb={1}>
                        <Box width='40%'>
                            <DataLabel>
                                {rec.label}
                            </DataLabel>
                        </Box>
                        <Box width='70%'>
                            <DataValue>
                                {rec.value}
                            </DataValue>
                        </Box>
                    </Box>
                ))
            }
        </Box>
    );
}


export const BoldTableView = ({data}: IProps) => {
    const classes = useStyles();
    return (
        <table className={classes.root}>
            <tbody>
            {data.map(row => <tr key={row.label}>
                <td style={{width: 100}}>
                    <DataLabel>
                        {row.label}
                    </DataLabel>
                </td>
                <td style={{padding: 3}}>
                    <DataValue>
                        {row.value}
                    </DataValue>
                </td>
            </tr>)
            }
            </tbody>
        </table>
    );
}



