import React, {useState} from "react";
import Navigation from "../../components/Layout";
import Paper from '@material-ui/core/Paper';
import {createStyles, makeStyles, Theme} from "@material-ui/core";
import clsx from 'clsx';
import {fakeContact, getEmail, getNin, getPhone, IContact, renderName} from "./types";
import XTable from "../../components/table/XTable";
import {XHeadCell} from "../../components/table/XTableHead";
import Grid from '@material-ui/core/Grid';
import Filter from "./Filter";
import EmailLink from "../../components/EmalLink";
import ContactLink from "../../components/ContactLink";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        drawer: {
            borderRadius: 0,
            padding: theme.spacing(2)
        },
        content: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            })
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            })
        },
    }),
);

const headCells: XHeadCell[] = [
    {name: 'id', label: 'Name', render: (value, rec) => <ContactLink id={value} name={renderName(rec.person)}/>},
    {name: 'nin', label: 'NIN', render: (_, rec) => getNin(rec)},
    {name: 'email', label: 'Email', render: (_, rec) => <EmailLink value={getEmail(rec)}/>},
    {name: 'phone', label: 'Phone', render: (_, rec) => getPhone(rec)},
];

const fakeData: IContact[] = [];
for (let i = 0; i < 65; i++) {
    fakeData.push(fakeContact())
}
const Contacts = () => {
    const [open, setOpen] = useState(true);
    const [data, setData] = useState(fakeData);
    const classes = useStyles();

    function handleFilterToggle() {
        setOpen(!open);
    }

    return (
        <Navigation>
            <Grid className={classes.root} container spacing={2}>
                <Grid item xs={open ? 9 : 12} className={clsx(classes.content, {[classes.contentShift]: open})}>
                    <XTable
                        title="Contacts"
                        headCells={headCells}
                        data={data}
                        onFilterToggle={handleFilterToggle}
                        initialRowsPerPage={15}
                    />
                </Grid>
                <Grid item xs={3} style={{display: open ? "block" : "none"}}>
                    <Paper className={classes.drawer}>
                        <Filter/>
                    </Paper>
                </Grid>
            </Grid>
        </Navigation>
    );
}

export default Contacts
