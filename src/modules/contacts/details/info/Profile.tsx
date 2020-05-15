import React from 'react';
import Grid from '@material-ui/core/Grid';
import {ContactCategory, getNin, IContact, renderName} from "../../types";
import {Box, createStyles, makeStyles, Theme} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import PersonIcon from "@material-ui/icons/Person";
import PeopleIcon from "@material-ui/icons/Business";
import {grey} from "@material-ui/core/colors";
import {SuccessIcon} from "../../../../components/xicons";

interface IProps {
    data: IContact
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(2),
            borderRadius: 0
        },

        image: {
            height: 60,
            width: 60,
            marginRight: theme.spacing(1),
            marginTop: theme.spacing(1)
        },
        nameHolder: {
            paddingTop: theme.spacing(1)
        }
    })
);

const Profile = ({data}: IProps) => {
    const classes = useStyles()
    const nin = getNin(data)
    const isPerson = data.category === ContactCategory.Person
    return (
        <Grid container>
            <Grid item sm={6}>
                <Grid container justify="flex-start" alignItems="flex-start">
                    <Avatar className={classes.image}>{isPerson ? <PersonIcon fontSize='large'/> :
                        <PeopleIcon fontSize='large'/>}</Avatar>
                    <Grid item className={classes.nameHolder}>
                        <Typography variant='h5'>{renderName(data)}</Typography>
                        <Typography variant='body2'>{data.category}</Typography>
                        {
                            isPerson?
                                <Typography variant='body2'>NIN: {nin}</Typography>:
                                <Typography variant='body2'>TIN: {nin}</Typography>
                        }

                    </Grid>
                </Grid>
            </Grid>
            <Grid item sm={6}>
                <Box style={{ border: `1px solid ${grey[400]}`}} p={1}>
                    <Box pb={1}><Typography variant='body2'><b>KYC Summary</b></Typography></Box>
                    <Box display='flex' >
                        <Box width='30%'>
                            <Typography variant='body2'>
                                <SuccessIcon fontSize='inherit'/>
                                &nbsp;AML Ok
                            </Typography>
                            <Typography variant='body2'>
                                <SuccessIcon fontSize='inherit'/>
                                &nbsp;Risk Profile
                            </Typography>
                        </Box>
                        <Box width='50%'>
                            <Typography variant='body2'>
                                <SuccessIcon fontSize='inherit'/>
                                &nbsp;Sanctions List
                            </Typography>
                            <Typography variant='body2'>
                                <SuccessIcon fontSize='inherit'/>
                                &nbsp;PEP
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}
export default Profile;
