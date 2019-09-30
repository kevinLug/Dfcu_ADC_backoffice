import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {Typography} from "@material-ui/core";
import {chunkArray} from "../utils/arrayHelpers";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%'
        },
        row: {},
        col: {
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
        }
    }),
);

export interface IRec {
    label: string
    value: any
}

interface IProps {
    data: IRec[]
    columns?: number
}

const TableView = ({data}: IProps) => {
    const classes = useStyles();
    return (
        <table className={classes.root}>
            <tbody>
            {data.map(row => (
                <tr key={row.label}>
                    <td className={classes.col}>
                        <Typography variant='caption'>
                            <b>{row.label}</b>
                        </Typography>
                    </td>
                    <td className={classes.col}>
                        <Typography>
                            {row.value}
                        </Typography>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

const DetailView = ({data, columns}: IProps) => {
    const classes = useStyles();
    if (columns) {
        const parts = chunkArray(data, columns)
        return (
            <table className={classes.root}>
                <tbody>
                <tr>
                    {
                        parts.map((part, index) => (
                            <td key={index}>
                                <TableView data={part}/>
                            </td>
                        ))
                    }
                </tr>
                </tbody>
            </table>
        );
    } else {
        return <TableView data={data}/>
    }
}


export default DetailView;
