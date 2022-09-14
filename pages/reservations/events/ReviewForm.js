import * as React from "react";
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Image from 'next/image'

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { fontWeight } from "@mui/system";

const dateAsString = date => !(date) ? 'Termin unbekannt' : date.split('T')[0].split('-').reverse().join('.')

/**
 * Simple page showing a summary of all settings the user did
 * @param formik
 * @returns {JSX.Element}
 * @constructor
 */
const ReviewForm = ({formik, plaetze, event}) =>{
    const _formik = formik
    const _plaetze = plaetze
    const _event = event

    return <>
        <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
            <Paper variant="inlined">
                <List sx={{ width: '100%'}}>
                    <ListItem alignItems="flex-start">
                    <Image
                        width={180}
                        height={120}
                        src={'/logos/' + event.sponsoringaktivitaet_id + '.png'}
                    />
                        <ListItemText sx={{marginTop: '24px', paddingLeft:'20px'}}
                        primary={event.name}
                        secondary={
                            <React.Fragment>
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="caption"
                                color="text.primary"
                            >
                                Veranstaltungsdatum
                            </Typography>
                            - {dateAsString(event.veranstaltungsdatum)}
                            </React.Fragment>
                        }
                        />
                    </ListItem>
                </List>
                <Typography component="div" color="secondary.main">
                    <div><b key="description">Karteninfo</b></div>
                    Es werden <b>{formik.values.anzahlBesucher}</b> Besucherkarten und <b>{formik.values.anzahlBetreuer}</b>
                    &nbsp;Betreuerkarten reserviert. Die belastete Kostenstelle bei Buchung ist <b>{formik.values.kostenstelle}</b>.  
                </Typography>
                <br/>
                <Typography component="div" color="secondary.main">
                    <div><b key="description">Besucherinfo</b></div>
                    Sie haben <b>{formik.values.vorname} {formik.values.nachname}</b> von der Firma <b>{formik.values.firma} {formik.values.nachname}</b>
                    &nbsp;mit folgender Adresse: <b>{formik.values.strasse} {formik.values.hausnummer}, {formik.values.plz} {formik.values.wohnort}</b> als Besucher angegeben mit  
                    dieser Position: <b>{formik.values.position}</b>.
                </Typography>
                <br/>
                <Typography variant="caption">
                Wenn diese Informationen korrekt sind, kicken Sie auf RESERVIEREN, ansonsten korrigieren Sie bitte Ihre Informationen. 
                </Typography>
                {
                    // Icon Sponsoringaktivitaet
                    // ==============================
                    // Veranstaltungsname
                    //
                }
            </Paper>
        </Container>
    </>
}

export default ReviewForm