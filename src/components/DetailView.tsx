import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {Typography} from "@material-ui/core";

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
}

const DetailView = ({data}: IProps) => {
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


export default DetailView;
