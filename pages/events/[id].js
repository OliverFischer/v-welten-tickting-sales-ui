import Button from '@mui/material/Button';
import Image from 'next/image'
import {getUpcomingEvent} from '../../prisma/ticketing-adapter'
import Box from '@mui/material/Box';
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import * as React from "react";

export async function getServerSideProps({ params }){
    const event = await getUpcomingEvent(parseInt(params.id))
    return {
        props : { event }
    }
}

export default function Event({event}){

    const dateAsString = date => !date ? 'Termin unbekannt' : date.split('T')[0].split('-').reverse().join('.')

    return <>
        <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 }, marginTop: '-20px' }}>
                <Typography component="h3" variant="h4" align="center" >
                    <Image
                        width={240}
                        height={180}
                        src={'/logos/' + event.sponsoringaktivitaet_id + '.png'}
                    />
                </Typography>
                <Typography component="h1" variant="h4" align="center" color="primary.main">
                    {event.name}
                </Typography>
                <Typography component="h3" variant="h5" align="center" color="primary.main">
                    {dateAsString(event.veranstaltungsdatum)}
                </Typography>
                <Typography component="div" color="secondary.main">
                    <div><b key="description">Beschreibung:</b></div>
                    {event.beschreibung ||  'Es liegen keine weiteren Informationen zur Veranstaltung vor'}
                </Typography>
                <br/>
                <Typography component="div" color="secondary.main">
                    <div><b key="verfuegbareKarten">Verfügbare Karten:</b></div>
                </Typography>
                {
                    event?.veranstaltung_kartenkontingent.map((vk,idx) => {
                        const kartenkontingent = vk.kartenkontingent
                        return (
                            <React.Fragment key={`${kartenkontingent.id}_${idx}`}>
                                <div>
                                    <span >{kartenkontingent.kartenanzahl}x </span><span>{kartenkontingent.sitzkategorie.name}</span>
                                    <span >(
                                        <span >Kartenpreis: </span><span>{kartenkontingent.kosten_karte} Euro</span>
                                        <span > / Catering: </span><span>{kartenkontingent.kosten_catering} Euro</span>
                                     )</span>
                                </div>
                            </React.Fragment>
                        )
                    })
                }
                <br/>
                <br/>
                <br/>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        href="/"
                        sx={{marginRight: 'auto'}}
                    >
                        Eventliste
                    </Button>
                    <Button
                        variant="contained"
                        href={"/reservations/events/" + event.id}
                    >
                        Ticket reservieren
                    </Button>
                </Box>
            </Paper>
            
        </Container>
    </>
}

