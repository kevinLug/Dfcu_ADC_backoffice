import React, {useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: 400,
        },
        input: {
            marginLeft: theme.spacing(1),
            flex: 1,
        },
        iconButton: {
            padding: 10,
        },
        divider: {
            height: 28,
            margin: 4,
        },
    }),
);

interface IProps {
    onFilter: (v: string) => any
}

export default function SearchInput({onFilter}:IProps) {
    const classes = useStyles();
    const [value, setValue] = useState<string>("")

    function handleChange(event: any) {
        const v = event.target.value
        setValue(v)
        onFilter(v)
    }

    function handleClick() {
        setValue(value)
    }

    return (
        <Paper component="form" className={classes.root}>
            <IconButton className={classes.iconButton} aria-label="menu">
                <MenuIcon/>
            </IconButton>
            <InputBase
                value={value}
                onChange={handleChange}
                className={classes.input}
                placeholder="Search here"
                inputProps={{'aria-label': 'search here'}}
            />
            <IconButton type="submit" className={classes.iconButton} aria-label="search" onClick={handleClick}>
                <SearchIcon/>
            </IconButton>
        </Paper>
    );
}
