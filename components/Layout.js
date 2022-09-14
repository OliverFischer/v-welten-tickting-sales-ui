import Container from '@mui/material/Container';
import AppBar from "@mui/material/AppBar";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Fab from '@mui/material/Fab';
import Paper from '@mui/material/Paper'
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import LogoutIcon from '@mui/icons-material/Logout';
import { makeStyles } from '@mui/styles'

import * as React from "react";

import {userService} from '../services/user.service'
import Image from 'next/image';

const useStyles = makeStyles(theme => ({
    tBarButton: {
      margin: theme.spacing(1),
      [theme.breakpoints.down("sm")]: {
        minWidth: 32,
        paddingLeft: 8,
        paddingRight: 8,
        "& .MuiButton-startIcon": {
          margin: 0
        }
      }
    },
    tBarButtonText: {
      [theme.breakpoints.down("sm")]: {
        display: "none"
      }
    }
  }));

export const Layout = ({children}) => {

    const classes = useStyles();

    return (
        <Container component="main" maxWidth="md" sx={{mb: 4}}>
            <Box sc={{flexGrow: 1}}>
                <AppBar
                    position="absolute"
                    color="default"
                    elevation={0}
                    sx={{
                        position: 'relative',
                        borderBottom: (t) => `1px solid ${t.palette.divider}`,
                    }}
                >
                    <Toolbar>
                        <Image src={"/logo_gruen.png"} width={86} height={30}/> 
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}/>
                        <Button href="/" className={classes.tBarButton}>
                            <BookOnlineIcon/>
                            <span className={classes.tBarButtonText}>Events</span>
                        </Button>
                        <Button href="/reservations" className={classes.tBarButton}>
                            <EventSeatIcon/>
                            <span className={classes.tBarButtonText}>Reservierungen</span>
                        </Button>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}/>
                        <Button onClick={() => userService.logout()}><LogoutIcon/></Button>
                    </Toolbar>
                </AppBar>
            </Box>

            {children}

        </Container>
    );
}

export default Layout;